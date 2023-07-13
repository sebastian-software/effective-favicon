import { promises as fs } from 'fs';
import * as path from 'path';
import * as svgo from 'svgo';
import sharp from 'sharp';
import ico from 'png-to-ico';
import execa from 'execa';
import pngquant from 'pngquant-bin';

const svgOptimize = new svgo();

const iosImageSize = 150;
const iosImagePadding = 15; // can be adjusted

async function optimizePng(filePath: string) {
  await execa(pngquant, ['--quality=60-80', '-o', filePath, filePath]);
}

async function processSvgFile(filePath: string) {
  try {
    const fileName = path.basename(filePath, '.svg');
    const fileDir = path.dirname(filePath);
    const svgString = await fs.readFile(filePath, 'utf-8');

    const optimizedSvgString = (await svgOptimize.optimize(svgString)).data;

    // Save the optimized SVG with a "-opt" postfix
    const optimizedSvgFilePath = `${fileDir}/${fileName}-opt.svg`;
    await fs.writeFile(optimizedSvgFilePath, optimizedSvgString);

    // Generate PNG images at 32px, 192px, 512px and 150px
    const sizes = [32, 192, 512, iosImageSize];
    for (const size of sizes) {
      const pngFilePath = `${fileDir}/${fileName}-${size}.png`;
      await sharp(Buffer.from(optimizedSvgString)).resize(size, size).png().toFile(pngFilePath);

      if (size === 32) {
        // Create an icon (32px)
        const buffer = await fs.readFile(pngFilePath);
        const icoBuffer = await ico(buffer);
        await fs.writeFile(`${fileDir}/${fileName}.ico`, icoBuffer);
      }

      // Optimize the PNG
      await optimizePng(pngFilePath);
    }

    // Create a 180px png based on the 150px image and add padding
    const imgIosPath = `${fileDir}/${fileName}-ios.png`;
    await sharp(`${fileDir}/${fileName}-${iosImageSize}.png`)
      .extend({
        top: iosImagePadding,
        bottom: iosImagePadding,
        left: iosImagePadding,
        right: iosImagePadding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(imgIosPath);

    // Optimize the 180px PNG
    await optimizePng(imgIosPath);
  } catch (err) {
    console.error(`Error processing file ${filePath}: `, err);
  }
}

async function processSvgFiles(dirPath: string) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);
    if (stat && stat.isDirectory()) {
      processSvgFiles(filePath);
    } else if (path.extname(file) === '.svg' && !file.endsWith('-opt.svg')) {
      await processSvgFile(filePath);
    }
  }
}

// Replace with your directory path
processSvgFiles('/path/to/your/svg/icons/directory').catch(console.error);
