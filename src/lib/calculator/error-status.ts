import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';

export class ErrorStatus implements CalcStatus {
  calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  send(event: CalculatorEvent) {
    const calc = this.calculator;
    switch (event.type) {
      case 'clear':
        calc.transition(CalculatorStatusEnum.Idle);
        calc.resetState();
        break;
    }
  }
}
