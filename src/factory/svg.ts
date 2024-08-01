import { promises as fs } from "node:fs"

import { optimize } from "svgo"

import type { Options } from "../options.js"

export async function generateOptimizedSvg(
  filePath: string,
  filePrefix: string,
  options: Options
) {
  const rawSvg = await fs.readFile(filePath, "utf8")
  const optimizedContent = optimize(rawSvg).data

  const optimizedPath = `${filePrefix}-opt.svg`
  await fs.writeFile(optimizedPath, optimizedContent)

  return { svgContent: optimizedContent, svgPath: optimizedPath }
}
