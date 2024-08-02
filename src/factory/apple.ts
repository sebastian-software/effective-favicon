import sharp from "sharp"

import type { Options } from "../options.js"

export async function generateAppleTouchIcons(
  filePrefix: string,
  svgContent: string,
  options: Options
) {
  const imagePaths: string[] = []
  for (const size of options.appleIconSizes) {
    const pngFilePath = `${filePrefix}-apple-${size}.png`
    imagePaths.push(pngFilePath)

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png({
        palette: true,
        effort: 10,
        compressionLevel: 9,
        quality: options.pngQuality
      })
      .toFile(pngFilePath)
  }

  return imagePaths
}
