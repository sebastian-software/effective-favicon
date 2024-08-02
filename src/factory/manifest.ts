import { promises as fs } from "node:fs"
import { basename, extname } from "node:path"

import { readPackageUp } from "read-package-up"
import sharp from "sharp"

import type { Options } from "../options.js"
import type { WebManifest, WebManifestIcon } from "../types.js"

/**
 * Converts an image file to a base64 data URL string.
 * @param filePath - The path to the image file.
 * @returns A promise that resolves to the base64 data URL string.
 */
async function inlineIcon(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath)
    const ext = extname(filePath).slice(1) // Get the file extension without the dot
    const mimeType = `image/${ext}`
    const base64Data = data.toString("base64")
    const dataUrl = `data:${mimeType};base64,${base64Data}`
    return dataUrl
  } catch (error) {
    const wrapped =
      error instanceof Error
        ? new Error(`Failed to read file: ${error.message}`)
        : new Error("An unknown error occurred")
    throw wrapped
  }
}

export async function generateWebManifest(
  filePrefix: string,
  svgContent: string,
  options: Options
) {
  const pkg = await readPackageUp()
  const icons: WebManifestIcon[] = []
  const manifestData: WebManifest = {
    name: pkg?.packageJson.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    icons
  }

  for (const size of options.manifestIconSizes) {
    const pngFilePath = `${filePrefix}-pwa-${size}.png`

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png({
        palette: true,
        effort: 10,
        compressionLevel: 9,
        quality: options.pngQuality
      })
      .toFile(pngFilePath)

    icons.push({
      src: options.inlineManifestIcons
        ? await inlineIcon(pngFilePath)
        : basename(pngFilePath),
      type: "image/png",
      sizes: `${size}x${size}`
    })
  }

  const manifestPath = `${filePrefix}.webmanifest`
  await fs.writeFile(manifestPath, JSON.stringify(manifestData, undefined, 2))

  return manifestPath
}
