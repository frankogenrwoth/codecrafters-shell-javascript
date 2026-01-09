/*
 * the echo command implementation
 */



const executeEcho = (args) => {
  if (args.length === 0) return;

  const processed = args.map((arg) => {
    // Strip wrapping single or double quotes (shell-like)
    if (
      (arg.startsWith('"') && arg.endsWith('"')) ||
      (arg.startsWith("'") && arg.endsWith("'"))
    ) {
      arg = arg.slice(1, -1);
    }

    try {
      // Escape for JSON, then let JS process escapes
      return JSON.parse(
        `"${arg.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
      );
    } catch {
      // Fallback: print raw if parsing fails
      return arg;
    }
  });

  console.log(processed.join(" "));
};

module.exports = { executeEcho };
