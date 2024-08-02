import { promises as fs } from "node:fs"
import { basename } from "node:path"

import { readPackageUp } from "read-package-up"
import sharp from "sharp"

import { optimizePng } from "../helper.js"
import type { Options } from "../options.js"
import type { WebManifest, WebManifestIcon } from "../types.js"

export async function generateWebManifest(
  filePrefix: string,
  svgContent: string,
  options: Options
) {
  const pkg = await readPackageUp()
  const icons: WebManifestIcon[] = []
  const manifestData: WebManifest = {
    name: pkg?.packageJson.name,
    short_name: pkg?.packageJson.name,
    description: pkg?.packageJson.description,
    start_url: ".",
    scope: "/",
    display: "standalone",
    icons
  }

  for (const size of options.manifestIconSizes) {
    const pngFilePath = `${filePrefix}-pwa-${size}.png`
    icons.push({
      src: basename(pngFilePath),
      type: "image/png",
      sizes: `${size}x${size}`
    })

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngFilePath)

    await optimizePng(pngFilePath, options)
  }

  const manifestPath = `${filePrefix}.webmanifest`
  await fs.writeFile(manifestPath, JSON.stringify(manifestData, undefined, 2))

  return manifestPath
}
