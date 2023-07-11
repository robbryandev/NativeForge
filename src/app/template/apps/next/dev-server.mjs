/*
the library magicast being used for codegen doesn't support parsing commonjs modules
so this file had to be rewritten this way since making it use es6 syntax broke the workspace linking
I know it looks horrible
*/

import cli from "../../node_modules/next/dist/cli/next-dev.js";
import nativeforgeConfig from "../../packages/app/nativeforge.config.mjs";

cli.nextDev(["-p", nativeforgeConfig.nextPort]);
