import { promises as fs } from "fs"
import * as path from "path"
import { optimize } from "svgo"
import sharp from "sharp"
import ico from "png-to-ico"
import { exec } from "child_process"
import pngquant from "pngquant-bin"

export const DEFAULTS = {
  MAX_IOS_IMAGE_SIZE: 180,
  IOS_IMAGE_PADDING: 0,
  IOS_PADDING_COLOR: { r: 0, g: 0, b: 0, alpha: 0 },
  PNG_QUALITY: "80-90",
  MANIFEST_ICON_SIZES: [192, 512],
  APPLE_ICON_SIZES: [180],
  FAV_ICON_SIZES: [16, 32]
}

export type OPTIONS = typeof DEFAULTS

export async function optimizePng(filePath: string, options: OPTIONS) {
  return new Promise((resolve, reject) => {
    const command = `${pngquant} --quality=${options.PNG_QUALITY} --strip --force --output ${filePath} ${filePath}`
    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(undefined)
      }
    })
  })
}

export async function processSvgFile(filePath: string, options: OPTIONS) {
  try {
    const fileName = path.basename(filePath, ".svg")
    const fileDir = path.dirname(filePath)

    const fileBase = path.join(fileDir, fileName)

    const rawSvg = await fs.readFile(filePath, "utf-8")
    const svgContent = optimize(rawSvg).data

    // Save the optimized SVG with a "-opt" postfix
    const optimizedSvgFilePath = `${fileBase}-opt.svg`
    await fs.writeFile(optimizedSvgFilePath, svgContent)

    // Generate bitmap images
    await generateWebManifest(fileBase, svgContent, options)
    await generateClassicFavicon(fileBase, svgContent, options)
    await generateAppleTouchIcon(fileBase, svgContent, options)
  } catch (err) {
    console.error(`Error processing file ${filePath}: `, err)
  }
}

async function generateWebManifest(
  fileBase: string,
  svgContent: string,
  options: OPTIONS
) {
  for (const size of options.MANIFEST_ICON_SIZES) {
    const pngFilePath = `${fileBase}-${size}.png`

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngFilePath)

    await optimizePng(pngFilePath, options)
  }
}

async function generateClassicFavicon(
  fileBase: string,
  svgContent: string,
  options: OPTIONS
) {
  const favBuffer = await Promise.all(
    options.FAV_ICON_SIZES.map((size) => {
      return sharp(Buffer.from(svgContent)).resize(size, size).png().toBuffer()
    })
  )

  // Create ICO FILE based on different source images
  const icoBuffer = await ico(favBuffer)
  await fs.writeFile(`${fileBase}.ico`, icoBuffer)
}

async function generateAppleTouchIcon(
  fileBase: string,
  svgContent: string,
  options: OPTIONS
) {
  for (const size of options.APPLE_ICON_SIZES) {
    const pngFilePath = `${fileBase}-${size}.png`

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngFilePath)

    await optimizePng(pngFilePath, options)
  }
}

export async function processSvgFiles(dirPath: string, options = DEFAULTS) {
  const files = await fs.readdir(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = await fs.stat(filePath)
    if (stat && stat.isDirectory()) {
      processSvgFiles(filePath, options)
    } else if (path.extname(file) === ".svg" && !file.endsWith("-opt.svg")) {
      await processSvgFile(filePath, options)
    }
  }
}
