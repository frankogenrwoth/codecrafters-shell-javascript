const lex = async (input) => {
  return new Promise((resolve) => {
    const tokens = [];
    let current = "";
    let quote = null;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (quote) {
        if (char === quote) {
          quote = null;
        } else if (char === '\\' && (quote === '"' || quote === "'")) {
          current += input[++i] || '';
        } else {
          current += char;
        }
        continue;
      }

      if (char === '"' || char === "'") {
        const closeIndex = input.indexOf(char, i + 1);
        if (closeIndex !== -1) {
          quote = char;
          continue;
        }
      }

      if (/\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
        continue;
      }

      current += char;
    }

    if (current) {
      tokens.push(current);
    }

    resolve(tokens);
  });
}

const lexCommand = async (input) => {
  return new Promise((resolve) => {
    let cmd = "";
    let quote = null;

    for (let i = 0; i < input.length; i++) {
      if (quote) {
        if (input[i] === quote) {
          quote = null;
        } else if (input[i] === '\\' && (quote === '"' || quote === "'")) {
          i++; // skip escaped character
        } else {
          continue;
        }
      }

      if (input[i] === '"' || input[i] === "'") {
        const closeIndex = input.indexOf(input[i], i + 1);
        if (closeIndex !== -1) {
          quote = input[i];
          continue;
        }
      }

      if (/\s/.test(input[i])) {
        resolve(cmd);
        return;
      }
      cmd += input[i];
    }
    resolve(cmd);
  });
}

module.exports = { lex, lexCommand };