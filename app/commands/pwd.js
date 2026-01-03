const executePwd = async () => {
  return new Promise((resolve) => {
    console.log(process.cwd()),
      resolve(200);
  });
};

module.exports = { executePwd };
