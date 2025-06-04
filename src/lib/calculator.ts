/* eslint-disable */
import { CalcState, CalculatorEvent, CalculatorStatus } from './types';

export class Calculator {
  state: CalcState = {
    status: CalculatorStatus.Idle,
    value: 0,
    formattedValue: '0',
    operand: null,
    operator: null,
    memory: null,
  };

  send(event: CalculatorEvent) {
    console.log('Event received:', event);
    switch (this.state.status) {
      case CalculatorStatus.Idle:
        this.handleIdle(event);
        break;
      case CalculatorStatus.Calculating:
        this.handleCalculating(event);
        break;
      case CalculatorStatus.WaitingForOperator:
        this.handleWaitingForOperator(event);
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

  private handleIdle(event: CalculatorEvent) {}
  private handleWaitingForOperator(event: CalculatorEvent) {}
  private handleResult(event: CalculatorEvent) {}
  private handleError(event: CalculatorEvent) {}
  private handleCalculating(event: CalculatorEvent) {}

  private static normalizeValue(value: string) {
    return value.replace('.', ',');
  }

  // for debugging purposes
  _log() {
    console.clear();
    console.group('Calculator');
    console.table(this.state);
    console.groupEnd();
  }
}

let calc = new Calculator();
