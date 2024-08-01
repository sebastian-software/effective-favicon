import { promises as fs } from "node:fs"
import * as path from "node:path"

import { generateAppleTouchIcons } from "./factory/apple.js"
import { generateFavicon } from "./factory/favicon.js"
import { generateWebManifest } from "./factory/manifest.js"
import { generateReactComponent } from "./factory/react.js"
import { generateOptimizedSvg } from "./factory/svg.js"
import type { Options } from "./options.js";
import { DEFAULTS } from "./options.js"

export async function processSvgFile(filePath: string, options: Options) {
  try {
    const fileName = path.basename(filePath, ".svg")
    const fileDir = path.dirname(filePath)
    const filePrefix = path.join(fileDir, fileName)

    const { svgContent, svgPath } = await generateOptimizedSvg(
      filePath,
      filePrefix,
      options
    )

    const favIconPath = await generateFavicon(filePrefix, svgContent, options)

    const touchIconPaths = await generateAppleTouchIcons(
      filePrefix,
      svgContent,
      options
    )

    const manifestPath = await generateWebManifest(
      filePrefix,
      svgContent,
      options
    )

    await generateReactComponent(
      filePrefix,
      svgPath,
      manifestPath,
      favIconPath,
      touchIconPaths
    )
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
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
