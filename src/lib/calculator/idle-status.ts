import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';

export class IdleStatus implements CalcStatus {
  calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  send(event: CalculatorEvent) {
    const calc = this.calculator;

    switch (event.type) {
      case 'digit':
        if (event.value === '0') {
          break;
        }
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = event.value;
        calc.state.allClear = false;
        break;
      case 'negate':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = '-0';
        break;
      case 'operator':
        calc.transition(CalculatorStatusEnum.Calculating);
        calc.state.operator = event.value;
        calc.state.operand = this.calculator.state.value;
        calc.state.allClear = false;
        break;
      case 'comma':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = this.calculator.state.value + '.';
        calc.state.allClear = false;
        break;
      case 'clear':
        if (calc.memory.isEmpty()) {
          if (calc.state.value !== '0') {
            calc.value = '0';
          }
          break;
        }
        calc.memory.clear();
        break;
      case 'mr':
        if (calc.memory.isEmpty()) {
          break;
        }
        calc.value = calc.memory.getValue()!;
        break;
    }
  }
}
