let parseCommand = (command) => {
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

  return tokens;
}
