const nativeforge = require("app/nativeforge.config")
const cli = require('next/dist/cli/next-dev');

cli.nextDev(['-p', nativeforge.nextPort]);