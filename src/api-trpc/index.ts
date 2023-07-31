import Generator from 'yeoman-generator';
import { join } from "path"
import { cwd } from 'process';
import { execSync } from 'child_process';
import fs from "fs-extra";
import term from "cli-color";
import cast from "magicast";
import prettier from "prettier";
import addProviders from './providers';

module.exports = class extends Generator {
    copyApiTemplate() {
        this.log(term.blue("Creating trpc api in your NativeForge project\n"));
        const dir = cwd();
        let configPath = `${dir}/packages/app/nativeforge.config.mjs`
        cast.loadFile(configPath).then((ast) => {
            if (ast.exports.default.features.includes("api-trpc")) {
                this.log(term.red("your project already generated a trpc api"));
            } else if (ast.exports.default.features.includes("api-next")) {
                this.log(term.red("your project uses a nextjs api"));
            } else {
                const tempApp = join(__dirname, '/template/apps');
                const tempPackages = join(__dirname, '/template/packages');
                fs.copySync(tempApp, `${dir}/apps`);
                fs.copySync(tempPackages, `${dir}/packages`);
                const newPackages = [
                    "@trpc/client",
                    "@trpc/server",
                    "@trpc/react-query",
                    "@tanstack/react-query",
                    "zod"
                ]
                this.log(term.blue("Installing dependencies"))
                newPackages.forEach((p) => {
                    execSync(`yarn add ${p}`)
                })
                this.log(term.green("Installed dependencies"))

                addProviders()

                // @ts-ignore ast check not type checked properly
                ast.exports.default.features.push("api-trpc");
                // @ts-ignore generate exists on ast
                prettier.format(ast.generate().code, {
                    parser: "babel",
                    trailingComma: "none"
                }).then((newConfig) => {
                    fs.writeFileSync(configPath, newConfig)
                    this.log(term.green("Created api successfully\n"));
                })
            }
        })
    }
}