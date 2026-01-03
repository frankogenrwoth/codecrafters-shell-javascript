const fs = require("fs");

/**
 * Check if the command is a builtin command (like exit or echo). If it is, report it as a builtin (<command> is a shell builtin) and stop.
 * If the command is not a builtin, your shell must go through every directory in PATH. For each directory:
 * Check if a file with the command name exists.
 * Check if the file has execute permissions.
 * If the file exists and has execute permissions, print <command> is <full_path> and stop.
 * If the file exists but lacks execute permissions, skip it and continue to the next directory.
 * If no executable is found in any directory, print <command>: not found.
*/
const executeType = (args, builtIns) => {
  const command = args[0];
  const extensions = [".exe", ".cmd", ".bat", ".bash", ".sh", ".zsh", ""];

  if (!command) {
    console.log(`invalid usage of command type`);
    return;
  }

  if (builtIns.includes(command)) {
    console.log(`${command} is a shell builtin`);
    return;
  }
  const separator = process.platform === "win32" ? ";" : ":";

  const pathDirs = process.env.PATH.split(separator).filter((dir) => dir);

  const path = require("path");

  for (const dir of pathDirs) {
    for (const ext of extensions) {
      const fullPath = path.join(dir, command);
      let fullPathWithExt = fullPath + ext;

      if (fs.existsSync(fullPathWithExt)) {
        try {
          fs.accessSync(fullPathWithExt, fs.constants.X_OK);
          console.log(`${command} is ${fullPath}`);
          return;
        } catch (err) {
          // File exists but is not executable, continue to next directory
          continue;
        }
      }
    }
  }
  console.log(`${command}: not found`);
}

module.exports = { executeType };
