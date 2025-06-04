type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

type DigitEvent = { type: 'digit'; value: Digit };
type PercentageEvent = { type: 'percentage' };
type CommaOp = { type: 'comma' };
type ClearEvent = { type: 'clear' };
type NegateEvent = { type: 'negate' };
type ResultEvent = { type: 'result' };

type DivOp = { type: 'operator'; value: '/' };
type MultOp = { type: 'operator'; value: '*' };
type AddOp = { type: 'operator'; value: '+' };
type SubOp = { type: 'operator'; value: '-' };

type OperatorEvent = DivOp | MultOp | AddOp | SubOp;
export type OperatorValue = OperatorEvent['value'];

/**
 * Event that can be sent to the calculator
 */
export type CalculatorEvent =
  | DigitEvent
  | CommaOp
  | ClearEvent
  | NegateEvent
  | ResultEvent
  | PercentageEvent
  | OperatorEvent;

/**
 * Current finite state of the calculator
 */

export enum CalculatorStatus {
  Idle = 'idle',
  Calculating = 'calculating',
  Waiting = 'waiting',
  Result = 'result',
  Error = 'error',
}

export type CalcState = {
  status: CalculatorStatus;
  operand: string | null;
  operator: OperatorValue | null;
  value: string;
  formattedValue: string;
  memory: string | null;
  allClear: boolean;
};
