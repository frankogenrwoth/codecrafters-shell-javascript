/*
 * the echo command implementation
 */

const { processArg } = require('../utils');

const executeEcho = (args) => {
  if (args.length === 0) return;

  const processed = args.map((arg) => processArg(arg));

  console.log(processed.join(" "));
};

module.exports = { executeEcho };
