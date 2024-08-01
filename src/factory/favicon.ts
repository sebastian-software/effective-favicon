import sharp from "sharp"
import { sharpsToIco } from "sharp-ico"

import type { Options } from "../options.js"

export async function generateFavicon(
  filePrefix: string,
  svgContent: string,
  options: Options
) {
  const sharpSources = [sharp(Buffer.from(svgContent))]
  const icoFileName = `${filePrefix}.ico`
  await sharpsToIco(sharpSources, icoFileName, {
    sizes: options.FAV_ICON_SIZES,
    resizeOptions: {}
  })

  return icoFileName
}
