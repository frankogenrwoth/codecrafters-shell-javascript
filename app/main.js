const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function inputCommand() {
  rl.question("$ ", (command) => {
    console.log(`${command}: command not found`);
    inputCommand();
  });
}

inputCommand();

