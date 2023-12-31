import { processSvgFiles } from "./process.js"

const args = process.argv.slice(2)
if (args.length !== 1) {
  console.error("Usage: effective-favicon <directory>")
  process.exit(1)
}

processSvgFiles(args[0]).catch(console.error)
