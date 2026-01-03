const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const knownCommands = ["echo", "type", "exit"];

function executeCommand(command, args) {
  if (!knownCommands.includes(command)) {
    console.log(`${command}: command not found`);
    return;
  }


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
      if (args.length === 0) {
        console.log(`${args[0]}: command not found`);
      } else {
        console.log(`${args[0]} is a shell builtin`);
      }
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
    if (knownCommands.includes(cmd)) {
      executeCommand(cmd, args.slice(1));
    } else {
      console.log(`${command}: command not found`);
    }

    inputCommand();
  });
}

inputCommand();

