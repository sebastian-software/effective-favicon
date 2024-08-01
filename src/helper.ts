import { exec } from "child_process"
import pngquant from "pngquant-bin"
import { Options } from "./options.js"

export async function optimizePng(filePath: string, options: Options) {
  return new Promise<void>((resolve, reject) => {
    const command = `${pngquant} --quality=${options.PNG_QUALITY} --strip --force --output ${filePath} ${filePath}`
    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
