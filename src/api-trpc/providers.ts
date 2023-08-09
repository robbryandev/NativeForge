import fs from "fs-extra";
import term from "cli-color";
import cast from "magicast";
import prettier from "prettier";
import { MergeRecursive } from "../utils/merge";
import * as parser from "@babel/parser";
import * as _generate from "@babel/generator";
const generate = _generate.default;
import * as _traverse from "@babel/traverse";
import { exit } from "process";
const traverse = _traverse.default;

export default function addProviders() {
    console.log(term.blue("Adding trpc providers"))
    try {
        const providerPath = "./packages/app/provider/index.tsx"
        const providerFile = fs.readFileSync(providerPath, "utf-8");
        const parseOptions: any = {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
        };
        let providerAst = parser.parse(providerFile, parseOptions);

        traverse(providerAst, {
            FunctionDeclaration: function (path) {
                const trpcBody = parser.parse(
                    `
                    const [queryClient] = useState(() => new QueryClient());
                    const [trpcClient] = useState(() =>
                        trpc.createClient({
                        links: [
                            httpBatchLink({
                            url: getApi(),
                            // You can pass any HTTP headers you wish here
                            async headers() {
                                return {
                                };
                            },
                            }),
                        ],
                        }),
                    );
                    `,
                    parseOptions
                );
                const innerBody = [...trpcBody.program.body, ...path.node.body.body];
                path.node.body.body = innerBody;
                for (let bodyNode of path.node.body.body) {
                    if (bodyNode.type === "ReturnStatement") {
                        const newReturn = `
                            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                                <QueryClientProvider client={queryClient}>
                                $CHILDREN
                                </QueryClientProvider>
                            </trpc.Provider>
                            `.replace("$CHILDREN", generate(bodyNode.argument as any).code);
                        const parsedReturn = parser.parseExpression(newReturn, parseOptions);
                        bodyNode.argument = parsedReturn;
                    }
                }
            },
        });

        let providerGen = generate(providerAst).code;
        let parsedProvider = cast.parseModule(providerGen)
        let imports = parsedProvider.imports;
        let newImports = cast.parseModule(`
            import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
            import { httpBatchLink } from '@trpc/client'
            import React, { useState } from 'react'
            import { trpc } from 'app/features/api/trpc/client'
            import getApi from "app/features/api/getApi"
            `).imports;
        const allImports = MergeRecursive(imports, newImports)
        parsedProvider.imports = allImports;
        const newProvider = parsedProvider.generate().code;


        prettier
            .format(newProvider, {
                parser: "typescript",
                semi: false,
                singleQuote: false,
            })
            .then((output) => {
                const formattedOutput = output.replace(/\bexport\b/g, "\nexport");
                console.log(term.green("Added trpc context providers"))
                fs.writeFileSync(providerPath, formattedOutput);
            });
    } catch (err) {
        console.log(term.red("Failed to add trpc providers"))
        console.log(err)
        exit()
    }
}