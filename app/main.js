const readline = require("readline");
const { executeType } = require("./commands/type");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const builtins = ["echo", "type", "exit"];

function executeCommand(command, args) {
  switch (command) {
    case "echo":
      if (args.length === 0) {
        console.log();
        return;
      }

      console.log(args.join(" "));
      break;
    case "exit":
      rl.close();
      break;
    case "type":
      executeType(args, builtins);
      break;
    default:
      console.log(`${command}: command not found`);
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

