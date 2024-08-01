import path from "path"
import { promises as fs } from "fs"
import { format } from "prettier"

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

export async function generateReactComponent(
  filePrefix: string,
  optimizedSvgFilePath: string,
  manifestPath: string,
  favIconPath: string,
  touchIconPaths: string[]
) {
  const touchIconSizes = touchIconPaths.map(
    (path) => path.match(/(\d+)\.png/)![1]
  )
  const touchIconImports = touchIconPaths
    .map((filePath, index) => {
      const size = touchIconSizes[index]
      return `import touchIcon${size} from "./${path.basename(filePath)}"`
    })
    .join("\n")

  const touchIconLinks = touchIconPaths
    .map((filePath, index) => {
      const size = touchIconSizes[index]
      return `<link rel="apple-touch-icon" sizes="${size}x${size}" href={touchIcon${size}} />`
    })
    .join("\n")

  const code = `
    import icoPath from "./${path.basename(favIconPath)}";
    import appManifestPath from "./${path.basename(manifestPath)}";
    ${touchIconImports}
    import svgPath from "./${path.basename(optimizedSvgFilePath)}";

    export function Favicon() {
      return (
        <>
          <link rel="icon" href={icoPath} sizes="32x32" />
          <link rel="manifest" href={appManifestPath} />
          <link rel="icon" href={svgPath} type="image/svg+xml" />
          ${touchIconLinks}
        </>
      );
    }
  `

  const fileDir = path.dirname(filePrefix)
  const fileBase = path.basename(filePrefix)
  const fileBasePascalCase = toPascalCase(fileBase)

  const formattedCode = await format(code, { parser: "typescript" })
  const reactFileName = `${path.join(fileDir, fileBasePascalCase)}.tsx`
  await fs.writeFile(reactFileName, formattedCode)
}
