import Generator from 'yeoman-generator';
import { copySync } from 'fs-extra';
import { join } from "path"
import { cwd } from 'process';
import term from "cli-color";

module.exports = class extends Generator {
    copyApiTemplate() {
        this.log(term.blue("Creating Nextjs api in your NativeForge project\n"))
        const tempApp = join(__dirname, '/template/apps');
        const tempPackages = join(__dirname, '/template/packages');
        const dir = cwd()
        copySync(tempApp, `${dir}/apps`)
        copySync(tempPackages, `${dir}/packages`)
        this.log(term.green("Created api successfully\n"))
    }
}