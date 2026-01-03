/*
 * the echo command implementation
 */
const executeEcho = (args) => {
  if (args.length === 0) {
    console.log();
    return;
  }
  console.log(args.join(" "));
};

module.exports = { executeEcho };
