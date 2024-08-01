import sharp from "sharp"

import { optimizePng } from "../helper.js"
import type { Options } from "../options.js"

export async function generateAppleTouchIcons(
  filePrefix: string,
  svgContent: string,
  options: Options
) {
  const imagePaths: string[] = []
  for (const size of options.APPLE_ICON_SIZES) {
    const pngFilePath = `${filePrefix}-apple-${size}.png`
    imagePaths.push(pngFilePath)

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngFilePath)

    await optimizePng(pngFilePath, options)
  }

  return imagePaths
}
