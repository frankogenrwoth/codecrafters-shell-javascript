const readline = require("readline");
const { lex } = require("./utils");
const { executeType, executeEcho, executeExternalCommand, executePwd, executeCd } = require("./commands");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const builtins = ["echo", "type", "exit", "pwd", "cd"];

async function executeCommand(command, args) {
  // handling single quotes in args
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

    const source = command;
    const tokens = await lex(source);

    // Filter out operator tokens and extract word values
    const wordTokens = tokens.filter(token => token.type === 'word').map(token => token.value);

    if (wordTokens.length === 0) {
      inputCommand();
      return;
    }

    // Process command to strip quotes if present
    let cmd = String(wordTokens[0]);
    if ((cmd.startsWith('"') && cmd.endsWith('"')) || (cmd.startsWith("'") && cmd.endsWith("'"))) {
      cmd = cmd.slice(1, -1);
    }

    await executeCommand(cmd, wordTokens.slice(1));

    // Prompt for the next command after executing the current one
    inputCommand();
  });
}

inputCommand();

