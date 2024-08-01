import { promises as fs } from "fs"
import { optimize } from "svgo"
import { Options } from "../options.js"

export async function generateOptimizedSvg(
  filePath: string,
  filePrefix: string,
  options: Options
) {
  const rawSvg = await fs.readFile(filePath, "utf-8")
  const optimizedContent = optimize(rawSvg).data

  const optimizedPath = `${filePrefix}-opt.svg`
  await fs.writeFile(optimizedPath, optimizedContent)

  return { svgContent: optimizedContent, svgPath: optimizedPath }
}
