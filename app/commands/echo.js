/*
 * the echo command implementation
 */
const executeEcho = (args) => {
  if (args.length === 0) {
    return;
  }
  
  console.log(args.join(" "));
  console.log(args.join(" ").replace(/["']/g, '').trim());
};

module.exports = { executeEcho };
