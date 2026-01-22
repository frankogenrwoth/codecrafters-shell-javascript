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
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { processArg } = require("../utils");

const findExecutable = (command) => {
  const separator = process.platform === "win32" ? ";" : ":";
  const extensions = process.platform === "win32" ? [".exe", ".cmd", ".bat"] : [""];
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

    // Process arguments to strip quotes and handle escapes
    const processedArgs = args.map((arg) => processArg(arg));

    const child = spawn(executablePath, processedArgs, {
      stdio: 'inherit',
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
