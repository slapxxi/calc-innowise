import { Calculator } from '../calculator';
import { Command } from '../types';
import { operate } from '../utils';

export class Power2Command implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate(this.calculator.value, '2', '**');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class Power3Command implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate(this.calculator.value, '3', '**');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class Root2Command implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate(this.calculator.value, '2', 'root');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class Root3Command implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate(this.calculator.value, '3', 'root');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class TenToPowerCommand implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate('10', this.calculator.value, '**');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class OneDivCommand implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate('1', this.calculator.value, '/');
    this.calculator.send({ type: 'assign', value: result });
  }
}

export class FactorialCommand implements Command {
  private calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  execute() {
    const result = operate(this.calculator.value, '', '!');
    this.calculator.send({ type: 'assign', value: result });
  }
}
