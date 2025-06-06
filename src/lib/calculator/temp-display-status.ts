import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';

export class TempDisplayStatus implements CalcStatus {
  calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  send(event: CalculatorEvent) {
    const calc = this.calculator;

    switch (event.type) {
      case 'digit':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = '0';
        calc.send(event);
        break;
      case 'clear':
        if (calc.state.operator === null) {
          calc.transition(CalculatorStatusEnum.Waiting);
          calc.value = '0';
          break;
        }
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.send(event);
        break;
      default:
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.send(event);
        break;
    }
  }
}
