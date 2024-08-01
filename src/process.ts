import { promises as fs } from "fs"
import * as path from "path"
import { optimize } from "svgo"
import sharp from "sharp"
import ico from "png-to-ico"
import { exec } from "child_process"
import pngquant from "pngquant-bin"
import { format } from "prettier"
import { readPackageUp } from "read-package-up"
import { WebManifest, WebManifestIcon } from "./types.js"

export const DEFAULTS = {
  MAX_IOS_IMAGE_SIZE: 180,
  IOS_IMAGE_PADDING: 0,
  IOS_PADDING_COLOR: { r: 0, g: 0, b: 0, alpha: 0 },
  PNG_QUALITY: "80-90",
  MANIFEST_ICON_SIZES: [192, 512],
  APPLE_ICON_SIZES: [
    // most iPads
    152,

    // pro iPads
    167,

    // most iPhones
    180
  ],
  FAV_ICON_SIZES: [16, 32]
}

export type OPTIONS = typeof DEFAULTS

export async function optimizePng(filePath: string, options: OPTIONS) {
  return new Promise((resolve, reject) => {
    const command = `${pngquant} --quality=${options.PNG_QUALITY} --strip --force --output ${filePath} ${filePath}`
    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(undefined)
      }
    })
  })
}

export async function processSingleSvgFile(filePath: string, options: OPTIONS) {
  try {
    const fileName = path.basename(filePath, ".svg")
    const fileDir = path.dirname(filePath)

    const filePrefix = path.join(fileDir, fileName)

    const rawSvg = await fs.readFile(filePath, "utf-8")
    const svgContent = optimize(rawSvg).data

    // Save the optimized SVG with a "-opt" postfix
    const optimizedSvgFilePath = `${filePrefix}-opt.svg`
    await fs.writeFile(optimizedSvgFilePath, svgContent)

    // Generate bitmap images
    const manifestPath = await generateWebManifest(
      filePrefix,
      svgContent,
      options
    )
    const favIconPath = await generateClassicFavicon(
      filePrefix,
      svgContent,
      options
    )
    const touchIconPaths = await generateAppleTouchIcons(
      filePrefix,
      svgContent,
      options
    )

    await generateReactComponent(
      filePrefix,
      optimizedSvgFilePath,
      manifestPath,
      favIconPath,
      touchIconPaths
    )
  } catch (err) {
    console.error(`Error processing file ${filePath}: `, err)
  }
}

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

async function generateReactComponent(
  filePrefix: string,
  optimizedSvgFilePath: string,
  manifestPath: string,
  favIconPath: string,
  touchIconPaths: string[]
) {
  // FIXME: Letzte Zahlen matchen... nicht erste... hier mit "favicon2" wurde es vorher immer "2".
  const touchIconSizes = touchIconPaths.map(
    (path) => path.match(/(\d+)\.png/)![1]
  )
  const touchIconPathsImports = touchIconPaths
    .map((filePath, index) => {
      const size = touchIconSizes[index]
      return `import touchIcon${size} from "./${path.basename(filePath)}"`
    })
    .join("\n")

  const touchIconLinks = touchIconPaths
    .map((filePath, index) => {
      const size = touchIconSizes[index]
      return `<link rel="apple-touch-icon" sizes="${size}x${size}" href={touchIcon${size}}  />`
    })
    .join("\n")

  const code = `
  import icoPath from "./${path.basename(favIconPath)}"
  import appManifestPath from "./${path.basename(manifestPath)}"
  ${touchIconPathsImports}
  import svgPath from "./${path.basename(optimizedSvgFilePath)}"

  export function Favicon() {
  return (<>
    <link rel="icon" href={icoPath} sizes="32x32" />
    <link rel="manifest" href={appManifestPath} />
    <link rel="icon" href={svgPath} type="image/svg+xml" />
    ${touchIconLinks}
    </>)
  }`

  const fileDir = path.dirname(filePrefix)
  const fileBase = path.basename(filePrefix)
  const fileBasePascalCase = toPascalCase(fileBase)

  const formattedCode = await format(code, { parser: "typescript" })

  const reactFileName = `${path.join(fileDir, fileBasePascalCase)}.tsx`
  await fs.writeFile(reactFileName, formattedCode)
}

async function generateWebManifest(
  filePrefix: string,
  svgContent: string,
  options: OPTIONS
) {
  const pkg = await readPackageUp()
  const icons: WebManifestIcon[] = []
  const data: WebManifest = {
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
    const pngfilePrefix = path.basename(pngFilePath)

    icons.push({
      src: pngfilePrefix,
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
  await fs.writeFile(manifestPath, JSON.stringify(data, null, 2))

  return manifestPath
}

async function generateClassicFavicon(
  filePrefix: string,
  svgContent: string,
  options: OPTIONS
) {
  const favBuffer = await Promise.all(
    options.FAV_ICON_SIZES.map((size) => {
      return sharp(Buffer.from(svgContent)).resize(size, size).png().toBuffer()
    })
  )

  // Create ICO FILE based on different source images
  const icoBuffer = await ico(favBuffer)
  const icoFileName = `${filePrefix}.ico`
  await fs.writeFile(icoFileName, icoBuffer)

  return icoFileName
}

async function generateAppleTouchIcons(
  filePrefix: string,
  svgContent: string,
  options: OPTIONS
) {
  const imagePaths: string[] = []
  for (const size of options.APPLE_ICON_SIZES) {
    const pngFilePath = `${filePrefix}-apple-${size}.png`
    imagePaths.push(pngFilePath)

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngFilePath)

    await optimizePng(pngFilePath, options)
  }

  return imagePaths
}

export async function processSvgFiles(dirPath: string, options = DEFAULTS) {
  const files = await fs.readdir(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = await fs.stat(filePath)
    if (stat && stat.isDirectory()) {
      processSvgFiles(filePath, options)
    } else if (path.extname(file) === ".svg" && !file.endsWith("-opt.svg")) {
      await processSingleSvgFile(filePath, options)
    }
  }
}
