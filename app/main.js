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
  const result = [];
  let current = '';
  let i = 0;

  while (i < argString.length) {
    const char = argString[i];

    if (char === ' ') {
      if (current !== '') {
        result.push(current);
        current = '';
      }
      i++;
      continue;
    }

    if (char === "'") {
      i++;
      while (i < argString.length && argString[i] !== "'") {
        current += argString[i];
        i++;
      }
      i++;
    }
    else if (char === '"') {
      i++;
      while (i < argString.length && argString[i] !== '"') {
        if (argString[i] === '\\' && i + 1 < argString.length) {
          const next = argString[i + 1];
          if (next === '"' || next === '\\' || next === '$' || next === '`' || next === '\n') {
            current += next;
            i += 2;
            continue;
          }
        }
        current += argString[i];
        i++;
      }
      i++;
    }
    else if (char === '\\') {
      if (i + 1 < argString.length) {
        current += argString[i + 1];
        i += 2;
      } else {
        i++;
      }
    }

    else {
      current += char;
      i++;
    }
  }

  if (current !== '') {
    result.push(current);
  }

  return result;
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

