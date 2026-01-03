/*
 * the echo command implementation
 */
const executeEcho = (args) => {
  if (args.length === 0) {
    return;
  }
  
  console.log(args[0]);
};

module.exports = { executeEcho };
