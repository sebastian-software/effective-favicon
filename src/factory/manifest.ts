import sharp from "sharp"
import { basename } from "path"
import { promises as fs } from "fs"
import { optimizePng } from "../helper.js"
import { WebManifest, WebManifestIcon } from "../types.js"
import { readPackageUp } from "read-package-up"
import { Options } from "../options.js"

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

  for (const size of options.MANIFEST_ICON_SIZES) {
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
  await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2))

  return manifestPath
}
