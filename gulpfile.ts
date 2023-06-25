import { exec } from "child_process"
import { series } from "gulp"
import {copySync, readdirSync, statSync} from "fs-extra"

function typescript(cb: CallableFunction) {
    exec("tsc")
    cb()
}

function copyTemplates(cb: CallableFunction) {
    const sourceDir = "./src"
    const destinationDir = "./generators"
    const copyRec = (src: string, dest: string) => {
        try {
            const gens = readdirSync(sourceDir);
            for (const gen of gens) {
                const searchDir = `${sourceDir}/${gen}`
                const dirs = readdirSync(searchDir);
                for (const d of dirs) {
                    const dir = `${searchDir}/${d}`
                    const dirSegments = dir.split("/")
                    const dirName = dirSegments[dirSegments.length - 1]
                    const stats = statSync(dir);
                    if (stats.isDirectory() && dirName == "template") {
                        console.log(dir)
                        copySync(dir, dir.replace(src, dest), {})
                    }
                }
            }
          } catch (error) {
            console.error('Error copying template folders:', error);
          }
    }
    copyRec(sourceDir, destinationDir)
    cb()
}

exports.default = series(
    typescript,
    copyTemplates
)