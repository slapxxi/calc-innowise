// @ts-check
const MAX_OUTPUT_LENGTH = 15;

export function operate(a, b, operator) {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);

  let result;

  switch (operator) {
    case '+':
      result = aNum + bNum;
      break;
    case '-':
      result = aNum - bNum;
      break;
    case '*':
      result = aNum * bNum;
      break;
    case '/':
      if (bNum === 0) {
        result = NaN;
      }
      result = aNum / bNum;
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  if (isNaN(result)) {
    return 'Error';
  }

  if (!isFinite(result)) {
    return 'Infinity';
  }

  return String(result);
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
 * Truncates a number to max decimal places.
 * @param {string} value - The number to truncate.
 * @param {number} max - The maximum number of decimal places.
 * @returns {string} The truncated number.
 */
export function truncateNumber(value, max = MAX_OUTPUT_LENGTH) {
  if (isFloat(value)) {
    return value.slice(0, max + 1);
  }
  return value.slice(0, max);
}

function isFloat(value) {
  let isFloat = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === '.') {
      isFloat = true;
      break;
    }
  }
  return isFloat;
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
  return String(num).toLowerCase().includes('e');
}

export function normalizeOutput(value) {
  return value.replace('.', ',');
}

// export function calculatorSmartDisplay(value, significantDigits = 12) {
export function calculatorSmartDisplay(value, significantDigits = 12) {
  const num = parseFloat(value);
  return parseFloat(num.toPrecision(significantDigits)).toString();
}

/**
 * Calculates the percentage of a value based on an operand.
 * @param {string} operand - The operand (percentage).
 * @param {string} percentage - The value to calculate the percentage of.
 * @returns {string} The calculated percentage as a string.
 */
export function calcPercentage(operand, percentage) {
  const numOperand = parseFloat(operand);
  const numPercentage = parseFloat(percentage);
  const result = (numOperand / 100) * numPercentage;
  return String(result);
}

/**
 * Negates a number represented as a string.
 * @param {string} value - The number to negate.
 * @returns {string} The negated number as a string.
 */
export function negate(value) {
  return String(-parseFloat(value));
}
