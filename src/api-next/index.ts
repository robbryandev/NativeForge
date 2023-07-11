import Generator from 'yeoman-generator';
import { copySync, writeFileSync } from 'fs-extra';
import { join } from "path"
import { cwd } from 'process';
import term from "cli-color";
import cast from "magicast";
import prettier from "prettier";

module.exports = class extends Generator {
    copyApiTemplate() {
        this.log(term.blue("Creating Nextjs api in your NativeForge project\n"));
        const dir = cwd();
        let configPath = `${dir}/packages/app/nativeforge.config.mjs`
        cast.loadFile(configPath).then((ast) => {
            if (ast.exports.default.features.includes("api-next")) {
                this.log(term.red("your project already generated a nextjs api"));
            } else {
                const tempApp = join(__dirname, '/template/apps');
                const tempPackages = join(__dirname, '/template/packages');
                copySync(tempApp, `${dir}/apps`);
                copySync(tempPackages, `${dir}/packages`);
                ast.exports.default.features.push("api-next");
                prettier.format(ast.generate().code, {
                    parser: "babel",
                    trailingComma: "none"
                }).then((newConfig) => {
                    writeFileSync(configPath, newConfig)
                    this.log(term.green("Created api successfully\n"));
                })
            }
        })
    }
}