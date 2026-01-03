const os = require("os");


const executeCd = async (args) => {
  return new Promise((resolve) => {
    if (args.length === 0) {
      console.log("cd: ${args[0]}: No such file or directory");
      resolve({ code: 400 });
    }

    const targetDirectory = args[0];

    if (targetDirectory === "~") {
      try {
        process.chdir(process.env.HOME || os.homedir());
        resolve({ code: 200 });
      } catch (err) {
        console.log(`cd: ${require("os").homedir()}: No such file or directory`);
        resolve({ code: 1 });
      }
      return;
    }

    try {
      process.chdir(targetDirectory);
      resolve({ code: 200 });
    } catch (err) {
      console.log(`cd: ${targetDirectory}: No such file or directory`);
      resolve({ code: 1 });
    }
  });
};

module.exports = { executeCd };
