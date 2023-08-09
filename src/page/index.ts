import Generator from 'yeoman-generator';
import fs from "fs-extra";
import term from "cli-color";
import cast from "magicast";
import prettier from "prettier";
import * as parser from "@babel/parser";
import * as _generate from "@babel/generator";
const generate = _generate.default;
import * as _traverse from "@babel/traverse";
const traverse = _traverse.default;
import { addImport } from '../utils/addImport';
import { type BaseArgs } from '../common/types';
import { exit } from 'process';

module.exports = class extends Generator {
    public nativePath: string
    public genCode: string
    constructor(args: string | string[], opts: BaseArgs) {
        super(args, opts, { customInstallTask: true });

        this.argument('name', {
            required: false,
            type: String,
            default: "NewPage",
            description: 'The name of your new page',
        });
        this.nativePath = "./packages/app/navigation/native/index.tsx"
        this.genCode = ""
    }

    start() {
        const pageExists = Object.keys(
            cast.parseModule(
                fs.readFileSync(`./packages/app/nativeforge.config.mjs`, "utf-8")
            ).exports.default.pages
        ).includes(this.options.name);
        if (pageExists) {
            console.log(term.red("Page: " + this.options.name + " already exists"))
            exit()
        }
        if (this.options.name[0] !== this.options.name.toUpperCase()[0]) {
            console.log(term.red("React components must start with a capital letter"))
            exit()
        }
        if (this.options.name === "NewPage") {
            this.log(term.yellow(`
  Using default page name: NewPage
        to change the generated page name make your page with:
          yo nativeforge your_page_name
  `));
        }
        this.log(term.blue(`Generating new page: ${this.options.name}`));
    }

    genNav() {
        const nativeNavPath = this.nativePath;
        const navSrc = fs.readFileSync(nativeNavPath, "utf-8");

        let navAst = parser.parse(navSrc, { sourceType: "module", plugins: ["typescript", "jsx"] });
        let pageName = this.options.name;

        traverse(navAst, {
            enter(path) {
                if (path.type == "TSTypeParameterInstantiation") {
                    const parent: any = path.parent;
                    if (parent.callee.name == "createNativeStackNavigator") {
                        let configPath = `./packages/app/nativeforge.config.mjs`
                        cast.loadFile(configPath).then((configAst) => {
                            const newPageType: any = cast.parseModule(`createNativeStackNavigator<{
                                        ${pageName}: undefined
                                      }>()`).$ast;
                            const parentMembers = parent.typeParameters.params[0].members;
                            const newParams = [
                                ...parentMembers,
                                ...newPageType.body[0].expression.typeParameters.params[0].members
                            ];
                            parent.typeParameters.params[0].members = newParams;
                            path.parent = parent;
                            traverse(navAst, {
                                enter(elementPath) {
                                    if (elementPath.type == "JSXElement" && elementPath.parent.type == "ReturnStatement") {
                                        const node: any = elementPath.node
                                        const nameObj = node.openingElement.name
                                        const nameKeys = Object.keys(nameObj)
                                        if (nameKeys.includes("object") && nameKeys.includes("property")) {
                                            const elmName = `${nameObj.object.name}.${nameObj.property.name}`
                                            if (elmName == "Stack.Navigator") {
                                                const newPageExpression: any = parser.parse(`
                                                        <Stack.Screen
                                                            name="${pageName}"
                                                            component={${pageName}Screen}
                                                            options={{
                                                            title: '${pageName}',
                                                            }}
                                                        />
                                                        `, { plugins: ["typescript", 'jsx'] })
                                                node.children = [...node.children, newPageExpression.program.body[0].expression]
                                                elementPath.node = node;
                                                const navWithNewElements = generate(navAst).code
                                                let navPageAst = cast.parseModule(navWithNewElements)
                                                navPageAst.imports = addImport(navPageAst.imports, `
                                                        import ${pageName}Screen from "app/features/${pageName}/screen"
                                                    `);
                                                prettier.format(generate(navPageAst.$ast).code, {
                                                    parser: "babel-ts",
                                                    trailingComma: "none"
                                                }).then((newNav) => {
                                                    const spaceNav = newNav
                                                        .replace(/\bexport\b/g, "\nexport")
                                                        .replace(/const Stack\b/g, "\nconst Stack");
                                                    fs.writeFileSync(nativeNavPath, spaceNav)
                                                    console.log(newNav)
                                                    console.log(term.green(`Created page ${pageName}`));
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                            )
                        }
                        )
                    }
                }
            }
        });
    }

    addPage() {
        const newPageScreen = __dirname + "/template/packages/app/features/Page/screen.tsx"
        const pagePath = `./packages/app/features/${this.options.name}/`
        if (!fs.existsSync(pagePath)) {
            fs.mkdir(pagePath)
            fs.writeFileSync(pagePath + "screen.tsx",
                fs.readFileSync(newPageScreen, "utf-8")
                    .replace(/\$page/g, this.options.name)
            )
        }

        let navPageAst = cast.parseModule(fs.readFileSync(this.nativePath, "utf-8"))
        navPageAst.imports = addImport(navPageAst.imports, `
            import ${this.options.name}Screen from "app/features/${this.options.name}/screen"
        `);
        console.log("import list ast")
        console.log(navPageAst.$ast)
        prettier.format(generate(navPageAst.$ast).code, {
            parser: "babel-ts",
            trailingComma: "none"
        }).then((newNav) => {
            const spaceNav = newNav
                .replace(/\bexport\b/g, "\nexport")
                .replace(/const Stack\b/g, "\nconst Stack");
            fs.writeFileSync(this.nativePath, spaceNav)
        })
    }

    addLink() {
        const newPageLink = __dirname + "/template/apps/next/pages/Page/index.tsx"
        const pagePath = `./apps/next/pages/${this.options.name}/`
        if (!fs.existsSync(pagePath)) {
            fs.mkdir(pagePath)
            fs.writeFileSync(pagePath + "index.tsx",
                fs.readFileSync(newPageLink, "utf-8")
                    .replace(/\$page/g, this.options.name)
                    .replace("$Page", this.options.name)
            )
        }
    }

    updateConfig() {
        let configPath = `./packages/app/nativeforge.config.mjs`
        let ast = cast.parseModule(fs.readFileSync(configPath, "utf-8"))
        ast.exports.default.pages[this.options.name] = this.options.name
        fs.writeFileSync(configPath ,ast.generate().code)
    }
}