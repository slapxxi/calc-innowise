// @ts-check

export function operate(a, b, operator) {
  a = parseFloat(a);
  b = parseFloat(b);

  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        result = NaN;
      }
      result = a / b;
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  if (isNaN(result)) {
    return 'Error';
  }

  return removeTrailingZeroes(String(result.toFixed(8)));
}

export function highlightActiveOperator(operator) {
  let el;
  switch (operator) {
    case '*':
      el = document.querySelector('[data-value="*"]');
      break;
    case '-':
      el = document.querySelector('[data-value="-"]');
      break;
    case '+':
      el = document.querySelector('[data-value="+"]');
      break;
    case '/':
      el = document.querySelector('[data-value="/"]');
      break;
    default:
      return;
  }
  el?.classList.add('button_active');
}

/**
 * Removes the active operator highlight from the buttons.
 */
export function removeActiveOperator() {
  document.querySelector('.button_active')?.classList.remove('button_active');
}

/**
 * Changes the text of the clear button based on the current state.
 * @param {string} text - The text to set for the clear button.
 */
export function changeClearButtonText(text) {
  const clearButton = document.querySelector('[data-type="clear"]');
  if (clearButton) {
    clearButton.textContent = text;
  }
}

/**
 * Truncates a number to 8 decimal places.
 * @param {string} value - The number to truncate.
 * @returns {string} The truncated number.
 */
export function truncateNumber(value) {
  let isFloat = false;
  let startingIndex = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === '.') {
      isFloat = true;
      startingIndex = i;
      break;
    }
  }
  if (isFloat) {
    return value.slice(0, startingIndex + 9);
  }
  return value;
}

/**
 * Converts a number to a percentage string.
 * @param {string} value - The number to convert.
 * @returns {string} The percentage string.
 */
export function toPercentage(value) {
  const number = parseFloat(value);
  if (isNaN(number)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return String(number * 0.01);
}

/**
 * Removes trailing zeroes from a string representation of a number.
 * @param {string} str - The string to process.
 * @returns {string} The processed string without trailing zeroes.
 */
export function removeTrailingZeroes(str) {
  return str.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '');
}

/**
 * Checks if a number is in exponential notation.
 * @param {string} num - The number to check.
 * @returns {boolean} True if the number is in exponential notation, false otherwise.
 */
export function isExponential(num) {
  return num.toString().toLowerCase().includes('e');
}

export function normalizeOutput(value) {
  return value.replace('.', ',');
}
