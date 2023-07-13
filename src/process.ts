import { promises as fs } from 'fs';
import * as path from 'path';
import {optimize} from 'svgo';
import sharp from 'sharp';
import ico from 'png-to-ico';
import { exec } from 'child_process';
import pngquant from "pngquant-bin"

const MAX_IOS_IMAGE_SIZE = 180;
const IOS_IMAGE_PADDING = 15;
const IOS_PADDING_COLOR = { r: 0, g: 0, b: 0, alpha: 0 }
const PNG_QUALITY = "75-85"
const FAV_ICON_SIZES = [16, 32];



export async function optimizePng(filePath: string) {
  return new Promise((resolve, reject) => {
    const command = `${pngquant} --quality=${PNG_QUALITY} --force --output ${filePath} ${filePath}`;
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(undefined);
      }
    });
  });
}

export async function processSvgFile(filePath: string) {
  try {
    const fileName = path.basename(filePath, '.svg');
    const fileDir = path.dirname(filePath);

    const fileBase = path.join(fileDir, fileName);

    const svgString = await fs.readFile(filePath, 'utf-8');
    const optimizedSvgString = optimize(svgString).data;

    // Save the optimized SVG with a "-opt" postfix
    const optimizedSvgFilePath = `${fileBase}-opt.svg`;
    await fs.writeFile(optimizedSvgFilePath, optimizedSvgString);

    // Generate PNG images for various configured sizes
    await generateBitmaps(fileBase, optimizedSvgString);

    // Generate favicon.ico
    await generateClassicFavicon(fileBase);

    // Create a 180px IOS png based on a smaller scaled image with padding
    await generateAppleTouchIcon(fileBase);
  } catch (err) {
    console.error(`Error processing file ${filePath}: `, err);
  }
}

async function generateBitmaps(fileBase: string, optimizedSvgString: string) {
  const iosImageSize = MAX_IOS_IMAGE_SIZE - IOS_IMAGE_PADDING * 2;
  const sizes = [...FAV_ICON_SIZES, 192, 512, iosImageSize];
  for (const size of sizes) {
    const pngFilePath = `${fileBase}-${size}.png`;
    await sharp(Buffer.from(optimizedSvgString)).resize(size, size).png().toFile(pngFilePath);
    await optimizePng(pngFilePath);
  }
}

async function generateClassicFavicon(fileBase: string) {
  const favBuffer = await Promise.all(FAV_ICON_SIZES.map((size) => {
    const pngFilePath = `${fileBase}-${size}.png`;
    return fs.readFile(pngFilePath);
  }));

  // Create ICO FILE based on different source images
  const icoBuffer = await ico(favBuffer);
  await fs.writeFile(`${fileBase}.ico`, icoBuffer);

  // Delete intermediate PNG files
  await Promise.all(FAV_ICON_SIZES.map((size) => {
    const pngFilePath = `${fileBase}-${size}.png`;
    return fs.rm(pngFilePath);
  }));
}

async function generateAppleTouchIcon(fileBase: string) {
  const iosImageSize = MAX_IOS_IMAGE_SIZE - IOS_IMAGE_PADDING * 2;
  const imgIosPath = `${fileBase}-ios.png`;
  await sharp(`${fileBase}-${iosImageSize}.png`)
    .extend({
      top: IOS_IMAGE_PADDING,
      bottom: IOS_IMAGE_PADDING,
      left: IOS_IMAGE_PADDING,
      right: IOS_IMAGE_PADDING,
      background: IOS_PADDING_COLOR
    })
    .toFile(imgIosPath);

  // Delete temporary file
  await fs.rm(`${fileBase}-${iosImageSize}.png`);

  // Optimize the 180px PNG
  await optimizePng(imgIosPath);
}

export async function processSvgFiles(dirPath: string) {
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
