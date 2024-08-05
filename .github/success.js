import fs from "node:fs";
// import { exec } from "node:child_process";
// import { promisify } from "node:util";
import path from "node:path";

let currentDir = process.cwd();

while (currentDir !== path.parse(currentDir).dir) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        break
    }
    currentDir = path.dirname(currentDir)
}
const pkgPath = currentDir + path.sep + "package.json";
process.cwd(currentDir);
console.log(`process.argv[2] => ${process.argv[2]}`);
console.log(`process.cwd => ${process.cwd()}`);

const firstArgument = process.argv[2].startsWith("v") ? process.argv[2].slice(1) : process.argv[2];

const pkg = JSON.parse(fs.readFileSync(pkgPath, {encoding: "utf-8"}));
pkg.version = firstArgument;

fs.writeFileSync(currentDir + path.sep + "package.json", JSON.stringify(pkg, null, 2), {encoding: "utf8"});


// const execPromise = promisify(exec);
// process.cwd(currentDir);
// try {
//     const { stdout, stderr } = await execPromise("npm pack");
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//     }
//     console.log(`stdout: ${stdout}`);
// } catch (error) {
//     console.error(`Error executing npm pack: ${error}`);
// }
//
//
