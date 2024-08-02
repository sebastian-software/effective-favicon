import { program } from "commander"

import { processSvgFiles } from "./index.js"
import { DEFAULTS } from "./options.js"

function splitList(value: string): number[] {
  return value.split(",").map(Number)
}

// Define the command-line options
program
  .argument("<fileOrFolder>", "File or folder to process")
  .option(
    "-p, --png-quality <quality>",
    "Set PNG quality",
    Number,
    DEFAULTS.pngQuality
  )
  .option(
    "-m, --manifest-icon-sizes <sizes>",
    "Set manifest icon sizes (comma-separated)",
    splitList,
    DEFAULTS.manifestIconSizes
  )
  .option(
    "-a, --apple-icon-sizes <sizes>",
    "Set Apple icon sizes (comma-separated)",
    splitList,
    DEFAULTS.appleIconSizes
  )
  .option(
    "-s, --fav-icon-sizes <sizes>",
    "Set favicon sizes (comma-separated)",
    splitList,
    DEFAULTS.favIconSizes
  )
  .option(
    "--no-inline-manifest-icons",
    "Disable inlining manifest icons",
    DEFAULTS.inlineManifestIcons
  )
  .parse(process.argv)

// Parse and normalize the options
const options = program.opts<typeof DEFAULTS>()
const fileOrFolder: string = program.args[0]

await processSvgFiles(fileOrFolder, options)
