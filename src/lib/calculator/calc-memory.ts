import { calculatorSmartDisplay, normalizeOutput, operate } from '../utils';

export class CalcMemory {
  value: string | null = null;
  formattedValue: string = '';

  add(value: string) {
    if (value === '0') {
      return;
    }

    let result;

    if (this.value === null) {
      result = operate('0', value, '+');
    } else {
      result = operate(this.value, value, '+');
    }

    if (this.value === '0' || result === 'Error' || result === 'Infinity') {
      this.clear();
      return;
    }

    this.value = result;
    this.formattedValue = normalizeOutput(calculatorSmartDisplay(this.value));
  }

  subtract(value: string) {
    let result;

    if (this.value === null) {
      result = operate('0', value, '-');
    } else {
      result = operate(this.value, value, '-');
    }

    if (result === '0' || result === 'Error' || result === 'Infinity') {
      this.clear();
      return;
    }

    this.value = result;
    this.formattedValue = normalizeOutput(calculatorSmartDisplay(this.value));
  }

  clear() {
    this.value = null;
    this.formattedValue = '';
  }

  getValue() {
    return this.formattedValue;
  }

  isEmpty() {
    return this.value === null && this.formattedValue === '';
  }
}
