const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function inputCommand() {
  rl.question("$ ", (command) => {
    if (command === "exit") {
      rl.close();
      return;
    }
    const args = command.split(" ");
    const cmd = args[0];

    if (cmd === "echo") {
      console.log(args.slice(1).join(" "));
      inputCommand();
      return;
    }

    console.log(`${command}: command not found`);
    inputCommand();
  });
}

inputCommand();

