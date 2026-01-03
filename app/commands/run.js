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
const { spawn } = require("child_process");

const findExecutable = (command) => {
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
          return fullPathWithExt;
        } catch (err) {
          continue;
        }
      }
    }
  }
  return null;
};


function executeExternalCommand(command, args) {
  return new Promise((resolve) => {
    const executablePath = findExecutable(command);

    if (!executablePath) {
      resolve(127);
      return;
    }

    const child = spawn(executablePath, args, {
      stdio: 'inherit',
      shell: true,
      argv0: command,
    });

    child.on('error', (err) => {
      console.error(`Error executing ${command}: ${err.message}`);
      resolve(1);
    });


    child.on('close', (code) => {
      resolve(code || 0);
    });
  });
}

module.exports = { executeExternalCommand };
