import { processSvgFiles } from "./index.js"

const args = process.argv.slice(2)
if (args.length !== 1) {
  console.error("Usage: effective-favicon <directory>")
  process.exit(1)
}

await processSvgFiles(args[0])
