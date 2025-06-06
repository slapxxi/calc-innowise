import { CalcMemory } from './calculator/calc-memory';
import { CalculatingStatus } from './calculator/calculating-status';
import { DisplayingResultStatus } from './calculator/displaying-result-status';
import { ErrorStatus } from './calculator/error-status';
import { IdleStatus } from './calculator/idle-status';
import { TempDisplayStatus } from './calculator/temp-display-status';
import { WaitingForInputStatus } from './calculator/waiting-input-status';
import {
  CalcState,
  CalcStatus,
  CalculatorEvent,
  CalculatorStatusEnum,
} from './types';
import { normalizeOutput } from './utils';

export class Calculator {
  state: CalcState = {
    value: '0',
    operand: null,
    operator: null,
    allClear: true,
    formattedValue: '0',
  };

  memory = new CalcMemory();

  private idleStatus = new IdleStatus(this);
  private waitingForInputStatus = new WaitingForInputStatus(this);
  private calculatingStatus = new CalculatingStatus(this);
  private displayingResultStatus = new DisplayingResultStatus(this);
  private tempDisplayStatus = new TempDisplayStatus(this);
  private errorStatus = new ErrorStatus(this);
  private statusString: CalculatorStatusEnum = CalculatorStatusEnum.Idle;

  status: CalcStatus = this.idleStatus;

  transition(status: CalculatorStatusEnum) {
    switch (status) {
      case CalculatorStatusEnum.Idle:
        this.status = this.idleStatus;
        break;
      case CalculatorStatusEnum.Waiting:
        this.status = this.waitingForInputStatus;
        break;
      case CalculatorStatusEnum.Calculating:
        this.status = this.calculatingStatus;
        break;
      case CalculatorStatusEnum.Result:
        this.status = this.displayingResultStatus;
        break;
      case CalculatorStatusEnum.TempDisplay:
        this.status = this.tempDisplayStatus;
        break;
      case CalculatorStatusEnum.Error:
        this.status = this.errorStatus;
        break;
      default:
        return console.error('Unknown state:', status);
    }
    this.statusString = status;
  }

  send(event: CalculatorEvent) {
    // todo: remove
    console.log('Calculator event:', event);
    if (event.type === 'mc') {
      this.memory.clear();
      return;
    }
    this.status.send(event);
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
  is(status: CalculatorStatusEnum) {
    return this.statusString === status;
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

  private log() {
    console.group('Calculator State');
    console.table(this.state);
    console.groupEnd();
  }
}
