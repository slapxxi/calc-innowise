export interface Command {
  execute(): void;
}

type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

type DigitEvent = { type: 'digit'; value: Digit };
type PercentageEvent = { type: 'percentage' };
type CommaEvent = { type: 'comma' };
type ClearEvent = { type: 'clear' };
type NegateEvent = { type: 'negate' };
type ResultEvent = { type: 'result' };

type DivOp = { type: 'operator'; value: '/' };
type MultOp = { type: 'operator'; value: '*' };
type AddOp = { type: 'operator'; value: '+' };
type SubOp = { type: 'operator'; value: '-' };
type PowerOp = { type: 'operator'; value: '**' };
type RootOp = { type: 'operator'; value: 'root' };

type MemoryClear = { type: 'mc' };
type MemoryRecall = { type: 'mr' };
type MemoryAdd = { type: 'm+' };
type MemorySubtract = { type: 'm-' };

type MemoryEvent = MemoryClear | MemoryRecall | MemoryAdd | MemorySubtract;

export type Shortcut =
  | 'n**2'
  | 'n**3'
  | '10**n'
  | 'root2'
  | 'root3'
  | '1/n'
  | 'n!';

// assigns value to the output and changes state accordingly
export type AssignEvent = { type: 'assign'; value: string };
export type OperatorEvent = DivOp | MultOp | AddOp | SubOp | PowerOp | RootOp;
export type OperatorValue = OperatorEvent['value'];

/**
 * Event that can be sent to the calculator
 */
export type CalculatorEvent =
  | DigitEvent
  | CommaEvent
  | ClearEvent
  | NegateEvent
  | ResultEvent
  | PercentageEvent
  | AssignEvent
  | MemoryEvent
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
  allClear: boolean;
};
