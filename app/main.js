const readline = require("readline");
const { executeType } = require("./commands/type");
const { executeEcho } = require("./commands/echo");
const { executeExternalCommand } = require("./commands/run");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const builtins = ["echo", "type", "exit"];

async function executeCommand(command, args) {
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
    default:
      if (command) {
        let n = await executeExternalCommand(command, args);
        
        if (n === 127) {
          console.log("command not found");
        }
      } else {
        console.log("command not found");
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

