const readline = require("readline");
const { executeType } = require("./commands/type");
const { executeEcho } = require("./commands/echo");
const { executeExternalCommand } = require("./commands/run");
const { executePwd } = require("./commands/pwd");
const { executeCd } = require("./commands/cd");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const builtins = ["echo", "type", "exit", "pwd", "cd"];


const cleanArgs = (args) => {
  const argString = args.join(" ");

  // Shell-accurate regex: preserves quoted content literally
  // Captures: single quotes | double quotes | unquoted words
  const matches = argString.match(/(?:'([^']*)')|(?:"([^"]*)")|(\\["']?[^\s'"\\]|\\s+)|(\S+)/g) || [];

  return matches.map(match => {
    if (match.startsWith("'") && match.endsWith("'")) {
      return match.slice(1, -1);
    }

    if (match.startsWith('"') && match.endsWith('"')) {
      let content = match.slice(1, -1);
      content = content.replace(/\\"/g, '"');
      return content;
    }

    if (match.startsWith('\\')) {
      return match.slice(1);
    }

    return match;
  }).filter(Boolean);
};

async function executeCommand(command,rawArgs) {
  // handling single quotes in args

  const args = cleanArgs(rawArgs);

  switch (command) {
    case "echo":
      executeEcho(args);
      break;
    case "exit":
      rl.close();
      break;
    case "type":
      executeType(args, builtins);
      break;
    case "pwd":
      await executePwd();
      break;
    case "cd":
      await executeCd(args);
      break;
    default:
      if (command) {
        let n = await executeExternalCommand(command, args);

        if (n === 127) {
          console.log(`${command}: command not found`);
        }
      } else {
        console.log(`${command}: command not found`);
      }
  }
}


function inputCommand() {
  rl.question("$ ", async (command) => {
    if (command === "exit") {
      rl.close();
      return;
    }
    const args = command.split(" ");
    const cmd = args[0];
    await executeCommand(cmd, args.slice(1));

    // Prompt for the next command after executing the current one
    inputCommand();
  });
}

inputCommand();

