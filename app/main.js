const readline = require("readline");
const { executeType } = require("./commands/type");
const { executeEcho } = require("./commands/echo");
const { executeExternalCommand } = require("./commands/run");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const builtins = ["echo", "type", "exit"];

function executeCommand(command, args) {
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
        executeExternalCommand(command, args);
      } else {
        console.log("");
      }
  }
}


function inputCommand() {
  rl.question("$ ", (command) => {
    if (command === "exit") {
      rl.close();
      return;
    }
    const args = command.split(" ");
    const cmd = args[0];
    executeCommand(cmd, args.slice(1));

    inputCommand();
  });
}

inputCommand();

