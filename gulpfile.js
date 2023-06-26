const proc = require("child_process")
const gulp = require("gulp")
const fs = require("fs-extra")

function typescript(cb) {
    proc.exec("tsc")
    cb()
}

function copyTemplates(cb) {
    const sourceDir = "./src"
    const destinationDir = "./generators"
    const copyRec = (src, dest) => {
        try {
            const gens = fs.readdirSync(sourceDir);
            for (const gen of gens) {
                const searchDir = `${sourceDir}/${gen}`
                const dirs = fs.readdirSync(searchDir);
                for (const d of dirs) {
                    const dir = `${searchDir}/${d}`
                    const dirSegments = dir.split("/")
                    const dirName = dirSegments[dirSegments.length - 1]
                    const stats = fs.statSync(dir);
                    if (stats.isDirectory() && dirName == "template") {
                        console.log(dir)
                        fs.copySync(dir, dir.replace(src, dest), {})
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

exports.default = gulp.series(
    typescript,
    copyTemplates
)