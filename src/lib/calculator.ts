/* eslint-disable */
import { CalcState, CalculatorEvent, CalculatorStatus } from './types';
import { factorial, nthRoot } from './utils';

const MAX_OUTPUT_LENGTH = 15;

export class Calculator {
  state: CalcState = {
    status: CalculatorStatus.Idle,
    value: '0',
    operand: null,
    operator: null,
    memory: null,
    allClear: true,
    formattedValue: '0',
  };

  send(event: CalculatorEvent) {
    console.log('Calculator event:', event);
    switch (this.state.status) {
      case CalculatorStatus.Idle:
        this.handleIdle(event);
        break;
      case CalculatorStatus.Calculating:
        this.handleCalculating(event);
        break;
      case CalculatorStatus.Waiting:
        this.handleWaiting(event);
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
    this.state.formattedValue = Calculator.normalizeValue(val);
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
            : Calculator.truncateNumber(this.state.value + event.value);
        break;
      case 'clear':
        if (this.state.value === '0' || this.state.operand === null) {
          this.state.status = CalculatorStatus.Idle;
          this.value = '0';
          this.state.operator = null;
          this.state.operand = null;
          this.state.allClear = true;
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
          let percentage = Calculator.calcPercentage(this.state.value, '1');
          this.state.value = percentage;
          this.state.formattedValue = Calculator.normalizeValue(
            Calculator.smartDisplay(percentage)
          );
          break;
        }
        let percentage = Calculator.calcPercentage(
          this.state.operand,
          this.state.value
        );
        this.state.value = percentage;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(percentage)
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
        result = Calculator.operate(
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
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(result)
        );
        this.state.operand = result;
        this.state.operator = event.value;
        break;
      case 'result':
        if (this.state.operand === null) {
          break;
        }
        result = Calculator.operate(
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
        this.value = Calculator.smartDisplay(result);
        break;
      case 'negate':
        this.value = Calculator.negate(this.state.value);
        break;
      case 'assign':
        if (event.value === 'Error' || event.value === 'Infinity') {
          this.state.status = CalculatorStatus.Error;
          this.value = event.value;
          break;
        }
        this.state.value = event.value;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(event.value)
        );
        break;
    }
  }

  private handleCalculating(event: CalculatorEvent) {
    let result;

    switch (event.type) {
      case 'digit':
        this.state.status = CalculatorStatus.Waiting;
        this.value = event.value;
        break;
      case 'negate':
        this.state.status = CalculatorStatus.Waiting;
        this.value = '-0';
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
          break;
        }
        this.value = '0';
        this.state.allClear = true;
        break;
      case 'result':
        result = Calculator.operate(
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
        this.state.operand = this.state.value;
        this.state.value = result;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(result)
        );
        break;
      case 'percentage':
        if (this.state.operator === '/' || this.state.operator === '*') {
          let percentage = Calculator.calcPercentage(this.state.value, '1');
          this.state.value = percentage;
          this.state.formattedValue = Calculator.normalizeValue(
            Calculator.smartDisplay(percentage)
          );
          break;
        }
        let percentage = Calculator.calcPercentage(
          this.state.operand!,
          this.state.value
        );
        this.state.value = percentage;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(percentage)
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
        this.state.status = CalculatorStatus.Waiting;
        this.state.value = event.value;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(event.value)
        );
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
        result = Calculator.operate(
          this.state.value,
          this.state.operand!,
          this.state.operator!
        );
        this.state.value = result;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(result)
        );
        break;
      case 'clear':
        if (this.state.value === '0') {
          this.state.status = CalculatorStatus.Idle;
          this.value = '0';
          this.state.operand = null;
          this.state.operator = null;
          this.state.allClear = true;
          break;
        }
        this.value = '0';
        this.state.allClear = true;
        break;
      case 'negate':
        this.value = Calculator.negate(this.state.value);
        break;
      case 'percentage':
        let percentage = Calculator.calcPercentage(this.state.value, '1');
        this.state.value = percentage;
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(percentage)
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
        this.state.formattedValue = Calculator.normalizeValue(
          Calculator.smartDisplay(event.value)
        );
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

  private static normalizeValue(value: string) {
    return value.replace('.', ',');
  }

  private static smartDisplay(value: string, significantDigits: number = 12) {
    const num = parseFloat(value);
    return parseFloat(num.toPrecision(significantDigits)).toString();
  }

  private static calcPercentage(operand: string, percentage: string) {
    const numOperand = parseFloat(operand);
    const numPercentage = parseFloat(percentage);
    const result = (numOperand / 100) * numPercentage;
    return String(result);
  }

  /**
   * Performs basic arithmetic operation on two numbers represented as strings
   */
  static operate(
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

  private static truncateNumber(
    value: string,
    max: number = MAX_OUTPUT_LENGTH
  ): string {
    if (Calculator.isFloat(value)) {
      return value.slice(0, max + 1);
    }
    return value.slice(0, max);
  }

  private static isFloat(value: string): boolean {
    return value.includes('.');
  }

  private static negate(value: string): string {
    if (value.startsWith('-')) {
      return value.slice(1);
    }
    return '-' + value;
  }

  private log() {
    console.group('Calculator State');
    console.table(this.state);
    console.groupEnd();
  }
}
