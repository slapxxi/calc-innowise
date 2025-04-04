// @ts-check
import '@/styles/main.css';
import '@/js/dropdown.js';

/** @type {State} */
let calculatorState = {
  status: 'idle',
  context: { value: '0', operator: null, operand: null, result: null },
};

const output = document.querySelector('.output');

try {
  const containerElement = document.querySelector('.calc');
  containerElement.addEventListener('click', handleClick);
} catch (e) {
  console.error('Error selecting container element:', e);
}

/**
 * Handles click events on the calculator buttons.
 * @param {MouseEvent} e - The click event triggered by the user.
 */
function handleClick(e) {
  if (e.target?.dataset) {
    const eventType = e.target.dataset;
    const nextState = send(calculatorState, eventType);
    console.table(nextState);

    // update output
    output.textContent = nextState.context.value;

    if (nextState.context.value === '0') {
      changeClearButtonText('AC');
    } else {
      changeClearButtonText('C');
    }

    // highlight active button when operator is selected
    if (nextState.status === 'calculating') {
      removeActiveOperator();
      highlightActiveOperator(nextState.context.operator);
    } else {
      removeActiveOperator();
    }

    calculatorState = nextState;
  }
}

/**
 * @typedef {'idle' | 'waiting' | 'calculating' | 'result'} Status
 * The status of the calculator.
 * - 'idle': The calculator is waiting for user input.
 * - 'waiting': The calculator is waiting for a digit or operator input.
 * - 'calculating': The calculator is performing a calculation.
 * - 'result': The calculator has displayed a result.
 */

/** @typedef {Object} Context
 * @property {string} value - The current value displayed on the calculator.
 * @property {string|null} operand - The current operand selected by the user.
 * @property {string|null} result - The result of the last calculation.
 * @property {string|null} operator - The current operator selected by the user.
 */

/**
 * @typedef {Object} State
 * @property {Status} status - The current status of the calculator.
 * @property {Context} context - The current context of the calculator.
 */

/**
 * @typedef {Object} CalcEvent
 * @property {string} type - The type of event (e.g., 'digit', 'operator', 'clear', 'negate' etc.).
 * @property {string} value - The value associated with the event (e.g., the digit or operator).
 */

/**
 * Sends the current state and event to determine the next state of the calculator.
 * @param {State} state - The current state of the calculator.
 * @param {CalcEvent} event - The event triggered by the user.
 * @returns {State} The next state of the calculator after processing the event.
 */

function send(state, event) {
  switch (state.status) {
    case 'idle':
      if (event.type === 'digit') {
        if (event.value === '0') {
          return state;
        }
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: event.value },
        };
      }
      if (event.type === 'negate') {
        return {
          ...state,
          status: 'waiting',
          context: {
            ...state.context,
            value: '-0',
          },
        };
      }
      if (event.type === 'operator') {
        return {
          ...state,
          status: 'calculating',
          context: {
            ...state.context,
            operator: event.value,
            operand: state.context.value,
          },
        };
      }
      if (event.type === 'comma') {
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: state.context.value + ',' },
        };
      }
      break;
    case 'waiting':
      if (event.type === 'clear') {
        if (state.context.value === '0' || state.context.operand === null) {
          return {
            ...state,
            status: 'idle',
            context: {
              ...state.context,
              value: '0',
              operator: null,
              operand: null,
            },
          };
        }
        return { ...state, context: { ...state.context, value: '0' } };
      }
      if (event.type === 'comma') {
        if (state.context.value.includes(',')) {
          return state;
        }
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: state.context.value + ',' },
        };
      }
      if (event.type === 'result') {
        if (state.context.operator === null) {
          return state;
        }
        return {
          ...state,
          status: 'result',
          context: {
            ...state.context,
            value: operate(
              state.context.operand,
              state.context.value,
              state.context.operator
            ),
          },
        };
      }
      if (event.type === 'digit') {
        // special case of -0 like in IOS calculator
        if (state.context.value === '-0') {
          return {
            ...state,
            context: { ...state.context, value: '-' + event.value },
          };
        }
        let value;
        if (state.context.value === '0') {
          value = event.value;
        } else {
          value = state.context.value + event.value;
        }
        return {
          ...state,
          status: 'waiting',
          context: {
            ...state.context,
            value: truncateNumber(value),
          },
        };
      }
      if (event.type === 'operator') {
        if (state.context.operator === null) {
          return {
            ...state,
            status: 'calculating',
            context: {
              ...state.context,
              operator: event.value,
              operand: state.context.value,
            },
          };
        }
        const value = operate(
          state.context.operand,
          state.context.value,
          state.context.operator
        );
        return {
          ...state,
          status: 'calculating',
          context: {
            ...state.context,
            value,
            operator: event.value,
            operand: state.context.value,
          },
        };
      }
      if (event.type === 'negate') {
        return {
          ...state,
          status: 'waiting',
          context: {
            ...state.context,
            value: String(
              -parseFloat(state.context.value.replace(',', '.'))
            ).replace('.', ','),
          },
        };
      }
      break;
    case 'calculating':
      if (event.type === 'clear') {
        return {
          ...state,
          status: 'idle',
          context: {
            ...state.context,
            value: '0',
            operand: null,
            operator: null,
          },
        };
      }
      if (event.type === 'negate') {
        return {
          ...state,
          context: {
            ...state.context,
            value: String(-parseFloat(state.context.value)),
          },
        };
      }
      if (event.type === 'digit') {
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: event.value },
        };
      }
      if (event.type === 'operator') {
        return {
          ...state,
          context: { ...state.context, operator: event.value },
        };
      }
      break;
    case 'result':
      if (event.type === 'clear') {
        return {
          ...state,
          status: 'idle',
          context: {
            ...state.context,
            value: '0',
            operand: null,
            operator: null,
          },
        };
      }
      if (event.type === 'result') {
        return {
          ...state,
          status: 'result',
          context: {
            ...state.context,
            value: operate(
              state.context.value,
              state.context.operand,
              state.context.operator
            ),
          },
        };
      }
      if (event.type === 'operator') {
        return {
          ...state,
          status: 'calculating',
          context: {
            ...state.context,
            operator: event.value,
            operand: state.context.value,
          },
        };
      }
      if (event.type === 'digit') {
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: event.value },
        };
      }
      break;
    default:
      return state;
  }

  return state;
}

function operate(a, b, operator) {
  a = parseFloat(a.replace(',', '.'));
  b = parseFloat(b.replace(',', '.'));
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
        throw new Error('Division by zero');
      }
      result = a / b;
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
  if (Number.isInteger(result)) {
    return String(result).replace('.', ',');
  }
  return String(result.toFixed(8)).replace('.', ',');
}

function highlightActiveOperator(operator) {
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

function removeActiveOperator() {
  document.querySelector('.button_active')?.classList.remove('button_active');
}

function changeClearButtonText(text) {
  const clearButton = document.querySelector('[data-type="clear"]');
  clearButton.textContent = text;
}

/**
 * Truncates a number to 8 decimal places.
 * @param {string} value - The number to truncate.
 * @returns {string} The truncated number.
 */
function truncateNumber(value) {
  let isFloat = false;
  let startingIndex = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === ',') {
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
