import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";


import path from "node:path";

import fs from "node:fs";

let currentDir = process.cwd()

while (currentDir !== path.parse(currentDir).dir) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        break
    }
    currentDir = path.dirname(currentDir)
}

console.log('Root directory:', currentDir)
const firstArgument = process.argv[2];

const require = createRequire(import.meta.url);
const pkg = require(currentDir + path.sep + "package.json");
pkg.version = firstArgument;

writeFileSync(currentDir + path.sep + "package.json", JSON.stringify(pkg, null, 2), {encoding: "utf8"});
