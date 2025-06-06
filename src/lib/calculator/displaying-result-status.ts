import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';
import {
  calcPercentage,
  calculatorSmartDisplay,
  negate,
  normalizeOutput,
  operate,
} from '../utils';

export class DisplayingResultStatus implements CalcStatus {
  calculator: Calculator;

  constructor(calculator: Calculator) {
    this.calculator = calculator;
  }

  send(event: CalculatorEvent) {
    const calc = this.calculator;
    let result;
    let percentage;

    switch (event.type) {
      case 'digit':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = event.value;
        break;
      case 'operator':
        calc.transition(CalculatorStatusEnum.Calculating);
        calc.state.operator = event.value;
        calc.state.operand = calc.state.value;
        break;
      case 'result':
        if (calc.state.operator === null) {
          break;
        }
        result = operate(
          calc.state.value,
          calc.state.operand!,
          calc.state.operator!
        );
        calc.state.value = result;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        break;
      case 'clear':
        if (calc.state.value === '0') {
          calc.transition(CalculatorStatusEnum.Idle);
          calc.value = '0';
          calc.state.operand = null;
          calc.state.operator = null;
          calc.state.allClear = true;
          calc.memory.clear();
          break;
        }
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = '0';
        calc.state.allClear = true;
        break;
      case 'negate':
        calc.value = negate(calc.state.value);
        break;
      case 'percentage':
        percentage = calcPercentage(calc.state.value, '1');
        calc.state.value = percentage;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(percentage)
        );
        break;
      case 'comma':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = '0.';
        break;
      case 'assign':
        if (event.value === 'Error' || event.value === 'Infinity') {
          calc.transition(CalculatorStatusEnum.Error);
          calc.value = event.value;
          break;
        }
        calc.state.value = event.value;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(event.value)
        );
        break;
      case 'm+':
        calc.transition(CalculatorStatusEnum.TempDisplay);
        calc.memory.add(calc.state.value);
        break;
      case 'm-':
        calc.transition(CalculatorStatusEnum.TempDisplay);
        calc.memory.subtract(calc.state.value);
        break;
      case 'mr':
        if (calc.memory.isEmpty()) {
          break;
        }
        calc.transition(CalculatorStatusEnum.TempDisplay);
        calc.value = calc.memory.getValue();
        break;
    }
  }
}
