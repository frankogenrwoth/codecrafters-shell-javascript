const executeCd = async (args) => {
  return new Promise((resolve) => {
    if (args.length === 0) {
      // No directory specified, go to home directory
      resolve({ code: 400 });
    }

    const targetDirectory = args[0];

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
