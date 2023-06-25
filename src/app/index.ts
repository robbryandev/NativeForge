import Generator from 'yeoman-generator';
import { join } from "path"
import { copySync } from 'fs-extra';
import { chdir, cwd } from 'process';
import term from "cli-color";
import { input } from '@inquirer/prompts';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';

type BaseArgs = {
  name: string
}

type CustomProps = {
  name: string,
  appId: string
}

async function customizePrompts(name: string) {
  const appId = await input({ message: term.magenta("Enter your app id (Format example: com.example.www):") })
  const props: CustomProps = {
    name: name,
    appId: appId
  }
  return props
}

module.exports = class extends Generator {
  constructor(args: string | string[], opts: BaseArgs) {
    super(args, opts, { customInstallTask: true });

    this.argument('name', {
      required: false,
      type: String,
      default: "nativeforgeApp",
      description: 'The name of your app',
    });
  }

  start() {
    if (this.options.name === "nativeforgeApp") {
      this.log(term.yellow(`
Using default app name: nativeforgeApp
      to change the generated app name make your app with:
        yo nativeforge your_app_name
`))
    }
    this.log(`Generating NativeForge app: ${this.options.name}`);
  }

  copyFolder() {
    const basePath = join(__dirname, '/template');
    copySync(basePath, `${cwd()}/${this.options.name}`)
    this.log(term.green("Copied base project\n"))
  }

  install() {
    this.log(term.blue.bold.underline("Welcome to the NativeForge setup\n"))
    const appPath = `${cwd()}/${this.options.name}`
    customizePrompts(this.options.name).then((props: CustomProps) => {
      this.log(props)

      /* Prompts to replace:
        $appName
        $appID
      */

      const readme = `${appPath}/readme.md`
      const newReadme = readFileSync(readme, "utf-8")
        .replace("$appName", props.name);
      writeFileSync(readme, newReadme)

      const packages = `${appPath}/package.json`
      const newPackages = readFileSync(packages, "utf-8")
        .replace(/\$appName/g, props.name);
      writeFileSync(packages, newPackages)

      const appJson = `${appPath}/apps/expo/app.json`
      const newAppJson = readFileSync(appJson, "utf-8")
        .replace(/\$appName/g, props.name)
        .replace(/\$appID/g, props.appId);
      writeFileSync(appJson, newAppJson)
      this.log(term.green("Updated expo settings"))
      this.log(term.blue("Installing dependencies"))
      chdir(appPath)
      exec("yarn install", (err, std) => {
        if (err) {
          this.log(term.red("Installation failed"))
          this.log(err)
        } else {
          this.log(std)
        }
        this.log(term.green("Installed dependencies"))
        this.log(term.blue("Thanks for using NativeForge"))
      })
    })
  }
}