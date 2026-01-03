const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

while (true) {
    rl.question("$ ", (command) => {
        console.log(`${command}: command not found`);
    });
}

