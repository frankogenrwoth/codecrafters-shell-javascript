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

module.exports = { lex };
