/* eslint-disable */
import { CalcMemory } from './calculator/calc-memory';
import { CalcState, CalculatorEvent, CalculatorStatus } from './types';
import {
  calcPercentage,
  calculatorSmartDisplay,
  negate,
  normalizeOutput,
  operate,
  truncateNumber,
} from './utils';

export class Calculator {
  state: CalcState = {
    status: CalculatorStatus.Idle,
    value: '0',
    operand: null,
    operator: null,
    allClear: true,
    formattedValue: '0',
  };
  memory = new CalcMemory();

  send(event: CalculatorEvent) {
    // todo: remove
    console.log('Calculator event:', event);

    if (event.type === 'mc') {
      this.memory.clear();
      return;
    }

    switch (this.state.status) {
      case CalculatorStatus.Idle:
        this.handleIdle(event);
        break;
      case CalculatorStatus.Waiting:
        this.handleWaiting(event);
        break;
      case CalculatorStatus.Calculating:
        this.handleCalculating(event);
        break;
      case CalculatorStatus.Result:
        this.handleResult(event);
        break;
      case CalculatorStatus.Error:
        this.handleError(event);
        break;
      default:
        console.error('Unknown state:', this.state.status);
    }
    // todo: remove
    this.log();
  }

  get formattedValue() {
    return this.state.formattedValue;
  }

  get operator() {
    return this.state.operator;
  }

  /**
   * Checks if the calculator is in a specific status
   */
  is(status: CalculatorStatus) {
    return this.state.status === status;
  }

  get isAllClear() {
    return this.state.allClear;
  }

  get value() {
    return this.state.value;
  }

  set value(val: string) {
    this.state.value = val;
    this.state.formattedValue = normalizeOutput(val);
  }

  private handleIdle(event: CalculatorEvent) {
    switch (event.type) {
      case 'digit':
        if (event.value === '0') {
          break;
        }
        this.state.status = CalculatorStatus.Waiting;
        this.value = event.value;
        this.state.allClear = false;
        break;
      case 'negate':
        this.state.status = CalculatorStatus.Waiting;
        this.value = '-0';
        break;
      case 'operator':
        this.state.status = CalculatorStatus.Calculating;
        this.state.operator = event.value;
        this.state.operand = this.state.value;
        this.state.allClear = false;
        break;
      case 'comma':
        this.state.status = CalculatorStatus.Waiting;
        this.value = this.state.value + '.';
        this.state.allClear = false;
        break;
      case 'clear':
        if (this.memory.isEmpty()) {
          if (this.state.value !== '0') {
            this.value = '0';
          }
          break;
        }
        this.memory.clear();
        break;
      case 'mr':
        if (this.memory.isEmpty()) {
          break;
        }
        this.value = this.memory.getValue()!;
        break;
    }
  }

  private handleWaiting(event: CalculatorEvent) {
    let result;

    switch (event.type) {
      case 'digit':
        // special case of -0 like in iOS calculator
        if (this.state.value === '-0') {
          this.value = '-' + event.value;
          this.state.allClear = false;
          break;
        }
        this.value =
          this.state.value === '0'
            ? event.value
            : truncateNumber(this.state.value + event.value);
        break;
      case 'clear':
        if (this.state.value === '0' || this.state.operand === null) {
          this.state.status = CalculatorStatus.Idle;
          this.value = '0';
          this.state.operator = null;
          this.state.operand = null;
          this.state.allClear = true;
          this.memory.clear();
          break;
        }
        this.state.status = CalculatorStatus.Calculating;
        this.value = '0';
        this.state.allClear = true;
        break;
      case 'percentage':
        if (
          this.state.operand === null ||
          this.state.operator === '*' ||
          this.state.operator === '/'
        ) {
          let percentage = calcPercentage(this.state.value, '1');
          this.state.value = percentage;
          this.state.formattedValue = normalizeOutput(
            calculatorSmartDisplay(percentage)
          );
          break;
        }
        let percentage = calcPercentage(this.state.operand, this.state.value);
        this.state.value = percentage;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(percentage)
        );
        break;
      case 'comma':
        if (this.state.value.includes('.')) {
          break;
        }
        this.value = this.state.value + '.';
        break;
      case 'operator':
        if (this.state.operator === null) {
          this.state.status = CalculatorStatus.Calculating;
          this.state.operator = event.value;
          this.state.operand = this.state.value;
          break;
        }
        result = operate(
          this.state.operand!,
          this.state.value,
          this.state.operator
        );
        if (result === 'Error' || result === 'Infinity') {
          this.state.status = CalculatorStatus.Idle;
          this.value = result;
          this.state.operand = null;
          this.state.operator = null;
          break;
        }
        this.state.status = CalculatorStatus.Calculating;
        this.state.value = result;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        this.state.operand = result;
        this.state.operator = event.value;
        break;
      case 'result':
        if (this.state.operand === null) {
          break;
        }
        result = operate(
          this.state.operand,
          this.state.value,
          this.state.operator!
        );
        if (result === 'Error' || result === 'Infinity') {
          this.state.status = CalculatorStatus.Error;
          this.value = result;
          this.state.operand = null;
          this.state.operator = null;
          this.state.allClear = true;
          break;
        }
        this.state.status = CalculatorStatus.Result;
        this.state.operand = this.state.value;
        this.value = calculatorSmartDisplay(result);
        break;
      case 'negate':
        this.value = negate(this.state.value);
        break;
      case 'assign':
        if (event.value === 'Error' || event.value === 'Infinity') {
          this.state.status = CalculatorStatus.Error;
          this.value = event.value;
          break;
        }
        this.state.status = CalculatorStatus.Result;
        this.state.value = event.value;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(event.value)
        );
        break;
      case 'm+':
        this.state.status = CalculatorStatus.Result;
        this.memory.add(this.state.value);
        break;
      case 'm-':
        this.state.status = CalculatorStatus.Result;
        this.memory.subtract(this.state.value);
        break;
      case 'mr':
        if (this.memory.isEmpty()) {
          break;
        }
        this.value = this.memory.getValue();
        break;
    }
  }

  private handleCalculating(event: CalculatorEvent) {
    let result;

    switch (event.type) {
      case 'digit':
        this.state.status = CalculatorStatus.Waiting;
        this.value = event.value;
        this.state.allClear = false;
        break;
      case 'negate':
        this.state.status = CalculatorStatus.Waiting;
        this.value = '-0';
        this.state.allClear = false;
        break;
      case 'operator':
        this.state.operator = event.value;
        break;
      case 'clear':
        if (this.state.operand === null || this.state.value === '0') {
          this.value = '0';
          this.state.status = CalculatorStatus.Idle;
          this.state.operand = null;
          this.state.operator = null;
          this.state.allClear = true;
          this.memory.clear();
          break;
        }
        this.value = '0';
        this.state.allClear = true;
        break;
      case 'result':
        result = operate(
          this.state.value,
          this.state.operand!,
          this.state.operator!
        );
        if (result === 'Error') {
          this.state.status = CalculatorStatus.Error;
          this.value = result;
          this.state.operand = null;
          this.state.operator = null;
          break;
        }
        this.state.status = CalculatorStatus.Result;
        this.state.value = result;
        this.state.operand = this.state.value;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        this.state.allClear = false;
        break;
      case 'percentage':
        if (this.state.operator === '/' || this.state.operator === '*') {
          let percentage = calcPercentage(this.state.value, '1');
          this.state.value = percentage;
          this.state.formattedValue = normalizeOutput(
            calculatorSmartDisplay(percentage)
          );
          break;
        }
        let percentage = calcPercentage(this.state.operand!, this.state.value);
        this.state.value = percentage;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(percentage)
        );
        break;
      case 'comma':
        this.state.status = CalculatorStatus.Waiting;
        this.value = '0.';
        break;
      case 'assign':
        if (event.value === 'Error' || event.value === 'Infinity') {
          this.state.status = CalculatorStatus.Error;
          this.value = event.value;
          break;
        }
        this.state.status = CalculatorStatus.Result;
        this.state.value = event.value;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(event.value)
        );
        break;
      case 'm+':
        this.memory.add(this.state.value);
        break;
      case 'm-':
        this.memory.subtract(this.state.value);
        break;
      case 'mr':
        if (this.memory.isEmpty()) {
          break;
        }
        this.state.status = CalculatorStatus.Result;
        this.value = this.memory.getValue();
        break;
    }
  }

  private handleResult(event: CalculatorEvent) {
    let result;

    switch (event.type) {
      case 'digit':
        this.state.status = CalculatorStatus.Waiting;
        this.value = event.value;
        break;
      case 'operator':
        this.state.status = CalculatorStatus.Calculating;
        this.state.operator = event.value;
        this.state.operand = this.state.value;
        break;
      case 'result':
        if (this.state.operator === null) {
          break;
        }
        result = operate(
          this.state.value,
          this.state.operand!,
          this.state.operator!
        );
        this.state.value = result;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        break;
      case 'clear':
        if (this.state.value === '0') {
          this.state.status = CalculatorStatus.Idle;
          this.value = '0';
          this.state.operand = null;
          this.state.operator = null;
          this.state.allClear = true;
          this.memory.clear();
          break;
        }
        this.state.status = CalculatorStatus.Waiting;
        this.value = '0';
        this.state.allClear = true;
        break;
      case 'negate':
        this.value = negate(this.state.value);
        break;
      case 'percentage':
        let percentage = calcPercentage(this.state.value, '1');
        this.state.value = percentage;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(percentage)
        );
        break;
      case 'comma':
        this.state.status = CalculatorStatus.Waiting;
        this.value = '0.';
        break;
      case 'assign':
        if (event.value === 'Error' || event.value === 'Infinity') {
          this.state.status = CalculatorStatus.Error;
          this.value = event.value;
          break;
        }
        this.state.value = event.value;
        this.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(event.value)
        );
        break;
      case 'm+':
        this.memory.add(this.state.value);
        break;
      case 'm-':
        this.memory.subtract(this.state.value);
        break;
      case 'mr':
        if (this.memory.isEmpty()) {
          break;
        }
        this.value = this.memory.getValue();
        break;
    }
  }

  private handleError(event: CalculatorEvent) {
    switch (event.type) {
      case 'clear':
        this.state.status = CalculatorStatus.Idle;
        this.value = '0';
        this.state.operand = null;
        this.state.operator = null;
        this.state.allClear = true;
        break;
    }
  }

  private log() {
    console.group('Calculator State');
    console.table(this.state);
    console.groupEnd();
  }
}
