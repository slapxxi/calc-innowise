// @ts-check
import '@/styles/main.css';
import '@/js/dropdown.js';
import {
  changeClearButtonText,
  removeActiveOperator,
  truncateNumber,
  toPercentage,
  normalizeOutput,
  operate,
  highlightActiveOperator,
} from '@/js/utils.js';

/** @type {CalcState} */
let calculatorState = {
  status: 'idle',
  context: { value: '0', operator: null, operand: null },
};

try {
  /** @type {HTMLFormElement | null} */
  const containerElement = document.querySelector('.calc');
  if (containerElement) {
    containerElement.addEventListener('click', handleClick);
  } else {
    throw new Error('Container element not found');
  }
} catch (e) {
  console.error('Error selecting container element:', e);
}

/**
 * Handles click events on the calculator buttons.
 * @param {MouseEvent} e - The click event triggered by the user.
 */
function handleClick(e) {
  if (e.target instanceof HTMLElement && e.target.dataset) {
    const { type, value } = e.target.dataset;

    if (type) {
      let calcEvent = { type, value };
      // @ts-ignore
      const nextState = send(calculatorState, calcEvent);

      const output = document.querySelector('.output');
      // update output
      if (output) {
        output.textContent = normalizeOutput(nextState.context.value);
      }

      if (
        nextState.context.value === '0' ||
        nextState.context.value === 'Error'
      ) {
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
}

/**
 * @typedef {'idle' | 'waiting' | 'calculating' | 'result' | 'error' } Status
 * The status of the calculator.
 * - 'idle': The calculator is waiting for user input.
 * - 'waiting': The calculator is waiting for a digit or operator input.
 * - 'calculating': The calculator is performing a calculation.
 * - 'result': The calculator has produced a result.
 */

/** @typedef {Object} Context
 * @property {string} value - The current value displayed on the calculator.
 * @property {string|null} operand - The current operand selected by the user.
 * @property {string|null} operator - The current operator selected by the user.
 */

/**
 * @typedef {Object} CalcState
 * @property {Status} status - The current status of the calculator.
 * @property {Context} context - The current context of the calculator.
 */

/**
 * @typedef {
  {type: 'operator', value: '-' | '+' | '*' | '/'} | 
  {type: 'digit', value: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'} | 
  {type: 'negate'} | 
  {type: 'comma'} | 
  {type: 'clear'} | 
  {type: 'percentage'} |
  {type: 'result'}
  } CalcEvent
 */

/**
 * Sends the current state and event to determine the next state of the calculator.
 * @param {CalcState} state - The current state of the calculator.
 * @param {CalcEvent} event - The event triggered by the user.
 * @returns {CalcState} The next state of the calculator after processing the event.
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
          context: { ...state.context, value: state.context.value + '.' },
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
        return {
          ...state,
          status: 'calculating',
          context: { ...state.context, value: '0' },
        };
      }
      if (event.type === 'percentage') {
        return {
          ...state,
          status: 'waiting',
          context: {
            ...state.context,
            value: toPercentage(state.context.value),
          },
        };
      }
      if (event.type === 'comma') {
        if (state.context.value.includes('.')) {
          return state;
        }
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: state.context.value + '.' },
        };
      }
      if (event.type === 'result') {
        if (state.context.operand === null) {
          return state;
        }
        let value = operate(
          state.context.operand,
          state.context.value,
          state.context.operator
        );
        if (value === 'Error') {
          return {
            ...state,
            status: 'error',
            context: {
              ...state.context,
              value: 'Error',
              operand: null,
              operator: null,
            },
          };
        }
        return {
          ...state,
          status: 'result',
          context: { ...state.context, value, operand: state.context.value },
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
        if (value === 'Error') {
          return {
            ...state,
            status: 'idle',
            context: {
              ...state.context,
              value: 'Error',
              operand: null,
              operator: null,
            },
          };
        }
        return {
          ...state,
          status: 'calculating',
          context: {
            ...state.context,
            value,
            operator: event.value,
            operand: value,
          },
        };
      }
      if (event.type === 'negate') {
        return {
          ...state,
          status: 'waiting',
          context: {
            ...state.context,
            value: String(-parseFloat(state.context.value)),
          },
        };
      }
      break;
    case 'calculating':
      if (event.type === 'clear') {
        if (state.context.operand === null || state.context.value === '0') {
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
        return { ...state, context: { ...state.context, value: '0' } };
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
      if (event.type === 'result') {
        let value = operate(
          state.context.value,
          state.context.operand,
          state.context.operator
        );
        if (value === 'Error') {
          return {
            ...state,
            status: 'error',
            context: { ...state.context, value, operand: null, operator: null },
          };
        }
        return {
          ...state,
          status: 'result',
          context: {
            ...state.context,
            value,
            operand: state.context.value,
          },
        };
      }
      if (event.type === 'percentage') {
        return {
          ...state,
          context: {
            ...state.context,
            value: toPercentage(state.context.value),
          },
        };
      }
      if (event.type === 'comma') {
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: '0.' },
        };
      }
      break;
    case 'result':
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
          status: 'calculating',
          context: {
            ...state.context,
            operator: event.value,
            operand: state.context.value,
          },
        };
      }
      if (event.type === 'result') {
        return {
          ...state,
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
      if (event.type === 'clear') {
        if (state.context.value === '0') {
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
      if (event.type === 'negate') {
        return {
          ...state,
          context: {
            ...state.context,
            value: String(-parseFloat(state.context.value)),
          },
        };
      }
      if (event.type === 'percentage') {
        return {
          ...state,
          context: {
            ...state.context,
            value: toPercentage(state.context.value),
          },
        };
      }
      if (event.type === 'comma') {
        return {
          ...state,
          status: 'waiting',
          context: { ...state.context, value: '0.' },
        };
      }
      break;
    case 'error':
      if (event.type === 'clear') {
        return {
          ...state,
          status: 'idle',
          context: { ...state.context, value: '0' },
        };
      }
      break;
    default:
      return state;
  }

  return state;
}
