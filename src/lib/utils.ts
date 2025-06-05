const MAX_OUTPUT_LENGTH = 15;

/**
 * Performs a basic arithmetic operation on two numbers
 */
export function operate(
  a: string,
  b: string,
  operator: string
): string | 'Error' | 'Infinity' {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);

  let result: number;

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
    case '**':
      result = aNum ** bNum;
      break;
    case 'root':
      try {
        result = nthRoot(aNum, bNum);
      } catch {
        result = NaN;
      }
      break;
    case '!':
      try {
        result = factorial(aNum);
      } catch {
        result = NaN;
      }
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

/**
 * Truncates a number to max decimal places.
 */
export function truncateNumber(value: string, max = MAX_OUTPUT_LENGTH) {
  if (isFloat(value)) {
    return value.slice(0, max + 1);
  }
  return value.slice(0, max);
}

/**
 * Checks if a string represents a float
 */
function isFloat(value: string) {
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
 * Removes trailing zeroes from a string representation of a number
 */
export function removeTrailingZeroes(str: string) {
  return str.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '');
}

/**
 * Checks if a number is in exponential notation.
 */
export function isExponential(num: number) {
  return String(num).toLowerCase().includes('e');
}

/**
 * Normalizes the output by replacing decimal points with commas.
 */
export function normalizeOutput(value: string) {
  return value.replace('.', ',');
}

/**
 * Attempts to convert a number to a string with a specified number of significant digits.
 */
export function calculatorSmartDisplay(
  value: string,
  significantDigits: number = 12
) {
  const num = parseFloat(value);
  return parseFloat(num.toPrecision(significantDigits)).toString();
}

/**
 * Calculates the percentage of a value based on an operand.
 */
export function calcPercentage(operand: string, percentage: string) {
  const numOperand = parseFloat(operand);
  const numPercentage = parseFloat(percentage);
  const result = (numOperand / 100) * numPercentage;
  return String(result);
}

/**
 * Negates a number represented as a string.
 */
export function negate(value: string) {
  if (value.startsWith('-')) {
    return value.slice(1);
  }
  return '-' + value;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeEmptyProperties<T extends Record<string, any>>(
  obj: T
): T {
  const newObj: T = {} as T;
  Object.keys(obj).forEach((key: keyof T) => {
    if (obj[key] === Object(obj[key]))
      newObj[key] = removeEmptyProperties(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
}

export function nthRoot(value: number, n: number, precision = 1e-10) {
  if (n <= 0) throw new Error('Root must be a positive integer');
  if (value < 0 && n % 2 === 0)
    throw new Error('Even root of negative number is not real');

  let x = value / n;
  let prev;

  do {
    prev = x;
    const numerator = (n - 1) * x + value / x ** (n - 1);
    x = numerator / n;
  } while (abs(x - prev) > precision);

  return x;
}

export function factorial(n: number) {
  if (n < 0) throw new Error('Factorial is not defined for negative numbers');
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function abs(x: number) {
  return x < 0 ? -x : x;
}
