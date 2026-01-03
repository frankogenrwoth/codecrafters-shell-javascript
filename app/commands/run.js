/*
  * When a command isn't a builtin, your shell should:
  *
  * Search for an executable with the given name in the directories listed in PATH (just like type does)
  * If found, execute the program
  * Pass any arguments from the command line to the program
  * For example, if the user types custom_exe arg1 arg2, your shell should:
  *
  * Find custom_exe in PATH
  * Execute it with three arguments: custom_exe (the program name), arg1, and arg2
  *
*/
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

function executeExternalCommand(command, args) {
  const extensions = [".exe", ".cmd", ".bat", ".bash", ".sh", ".zsh", ""];

  const separator = process.platform === "win32" ? ";" : ":";

  const pathDirs = process.env.PATH.split(separator).filter((dir) => dir);

  for (const dir of pathDirs) {
    for (const ext of extensions) {
      const fullPath = path.join(dir, command);
      let fullPathWithExt = fullPath + ext;
      if (fs.existsSync(fullPathWithExt)) {
        try {
          fs.accessSync(fullPathWithExt, fs.constants.X_OK);
          execFile(fullPathWithExt, args, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing ${command}: ${error.message}`);
              return;
            }
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
          return;
        } catch (err) {
          // File exists but is not executable, continue to next directory
          continue;
        }
      }
    }
  }
  console.log(`${command}: command not found`);
}
module.exports = { executeExternalCommand };
