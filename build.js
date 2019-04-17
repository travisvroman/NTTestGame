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

function copyFolderRecursiveSync(source, target) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = target;//path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
console.log("\x1b[35m***BUILD***\x1b[0m");

console.log("Cleaning...");
fsExtra.emptyDirSync("dist");

console.log("Building...");
try {
    cp.execSync("node node_modules/typescript/bin/tsc", {
        stdio: "inherit"
    });
    console.log("\x1b[35m***BUILD COMPLETE***\x1b[0m");
} catch (ex) {
    console.log(ex.stdout);
    console.log("\x1b[35m***BUILD FAILED***\x1b[0m");
}

console.log("Copying dependencies...");
copyFolderRecursiveSync("node_modules/NamorvTech/dist/", "dist");

console.log("Copying www...");
copyFolderRecursiveSync("www/", "dist");

console.log("Copying assets...");
copyFolderRecursiveSync("assets/", "dist/assets");

console.log("\x1b[35m***BUILD COMPLETE***\x1b[0m");