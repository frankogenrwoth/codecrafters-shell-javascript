/**
 * Tokenizes shell command input following POSIX shell token recognition rules
 * @param {string} command - The command string to parse
 * @returns {Promise<Array>} - Array of token objects with type ('word' or 'operator') and value
 */
const lex = async (command) => {
  return new Promise((resolve) => {
    const tokens = [];
    let currentToken = '';
    let quoteChar = null; // null, "'", '"', '`' for various quote types
    let inBackslash = false;
    let isOperatorToken = false; // True if currentToken is an operator
    let atTokenStart = true; // Track if we're at the start of a token (for # comment detection)

    const delimitToken = () => {
      if (currentToken) {
        tokens.push({ type: isOperatorToken ? 'operator' : 'word', value: currentToken });
        currentToken = '';
        isOperatorToken = false;
      }
      atTokenStart = true;
    };

    const operatorChars = new Set(['|', '&', ';', '(', ')', '<', '>']);
    const multiCharOps = { '|': '||', '&': '&&', '>': '>|' };

    for (let i = 0; i < command.length; i++) {
      const char = command[i];

      // Handle backslash escaping
      if (inBackslash) {
        if (char !== '\n') {
          currentToken += char;
          atTokenStart = false;
        }
        inBackslash = false;
        continue;
      }

      // Inside quotes
      if (quoteChar) {
        if (char === '\\' && quoteChar !== "'") {
          // Backslash escape in double quotes, backticks, or ANSI quotes
          inBackslash = true;
          currentToken += char;
        } else if (char === quoteChar) {
          // End quote
          currentToken += char;
          quoteChar = null;
        } else {
          currentToken += char;
        }
        atTokenStart = false;
        continue;
      }

      // Unquoted context

      // Backslash escape
      if (char === '\\') {
        inBackslash = true;
        currentToken += char;
        atTokenStart = false;
        continue;
      }

      // ANSI-C quoting $'...' - must check before regular quotes
      if (char === '$' && i + 1 < command.length && command[i + 1] === "'") {
        // If we were building an operator, delimit it first
        if (isOperatorToken) {
          delimitToken();
        }
        currentToken += char; // Add $
        i++; // Move to the '
        currentToken += command[i]; // Add '
        quoteChar = "'"; // Now we're in a quote context
        atTokenStart = false;
        continue;
      }

      // Backtick quoting - treat as command substitution (expansion)
      if (char === '`') {
        // If we were building an operator, delimit it first
        if (isOperatorToken) {
          delimitToken();
        }
        currentToken += char;
        quoteChar = '`'; // Enter backtick quote context
        atTokenStart = false;
        continue;
      }

      // Regular quoting start
      if (char === "'" || char === '"') {
        // If we were building an operator, delimit it first
        if (isOperatorToken) {
          delimitToken();
        }
        currentToken += char;
        quoteChar = char;
        atTokenStart = false;
        continue;
      }

      // Expansion start ($) - but not $' which is handled above
      if (char === '$') {
        // If we were building an operator, delimit it first
        if (isOperatorToken) {
          delimitToken();
        }
        currentToken += char;
        atTokenStart = false;
        continue;
      }

      // Comment: # at start of token (after blank/operator/newline)
      if (char === '#' && atTokenStart) {
        delimitToken();
        // Discard rest of line
        break;
      }

      // Operator character
      if (operatorChars.has(char)) {
        // Check if this can extend the previous operator
        if (isOperatorToken && multiCharOps[currentToken] && multiCharOps[currentToken].startsWith(currentToken + char)) {
          // Operator extension
          currentToken += char;
          continue;
        } else {
          // Operator delimitation: previous token must be delimited
          delimitToken();
          // Start new operator token
          currentToken = char;
          isOperatorToken = true;
          atTokenStart = false;
          continue;
        }
      }

      // Newline
      if (char === '\n') {
        delimitToken();
        continue;
      }

      // Blank (space or tab)
      if (char === ' ' || char === '\t') {
        delimitToken();
        continue;
      }

      // Word continuation
      if (isOperatorToken) {
        delimitToken();
      }
      currentToken += char;
      atTokenStart = false;
    }

    // End of input: delimit current token
    delimitToken();

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
        } else if (input[i] === '\\' && quote === '"') {
          cmd += input[++i] || '';
        } else {
          cmd += input[i];
        }
        continue;
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

/**
 * Process a shell argument token - strips quotes and handles escape sequences
 * @param {string} str - The raw token from the lexer
 * @returns {string} - The processed argument value
 */
const processArg = (str) => {
  let result = [];
  let quoteChar = null;
  let inBackslash = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Handle backslash escaping first (applies to both quoted and unquoted contexts)
    if (inBackslash) {
      result.push(char);  // Escaped char is literal
      inBackslash = false;
      continue;
    }

    if (quoteChar) {
      // Inside quotes
      if (char === '\\' && quoteChar === '"') {
        // Backslash only escapes in double quotes, not in single quotes
        inBackslash = true;
        continue;
      } else if (char === quoteChar) {
        quoteChar = null;  // End quotes
        continue;
      } else {
        result.push(char);  // Normal quoted char
        continue;
      }
    } else {
      // Outside quotes
      if (char === '"' || char === "'") {
        quoteChar = char;
        continue;
      }

      if (char === '\\') {
        inBackslash = true;
        continue;
      }

      result.push(char);  // Unquoted char
    }
  }

  // Handle trailing backslash outside quotes
  if (inBackslash) {
    result.push('\\');
  }

  return result.join('');
};

module.exports = { lex, lexCommand, processArg };
