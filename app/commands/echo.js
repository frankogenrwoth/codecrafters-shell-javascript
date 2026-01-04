/*
 * the echo command implementation
 */
const executeEcho = (args) => {
  if (args.length === 0) {
    return;
  }
  let m = args.map((arg) => {
    return arg.replace(/^['"]|['"]$|['"]{2}/g, "");
  });

  console.log(m.join(" "));
};

module.exports = { executeEcho };
