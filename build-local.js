var fs = require("fs");
var fsExtra = require("fs-extra");
var cp = require("child_process");
var path = require("path");

function copyFileSync(source, target) {

    var targetFile = target;

    // If target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target, createFolder) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = createFolder ? path.join(target, path.basename(source)) : target;
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder, true);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
console.log("\x1b[35m***BUILD LOCAL***\x1b[0m");

console.log("Cleaning...");
fsExtra.emptyDirSync("dist");

console.log("Building...");
cp.execSync("node node_modules/typescript/bin/tsc");

console.log("Copying dependencies...");
// Note: Pull from folder on local disk instead of package.
copyFolderRecursiveSync("../namorvtech/dist/", "dist", false);

console.log("Copying www...");
copyFolderRecursiveSync("www/", "dist", false);

console.log("Copying assets...");
copyFolderRecursiveSync("assets/", "dist/assets", false);

console.log("\x1b[35m***BUILD LOCAL COMPLETE***\x1b[0m");