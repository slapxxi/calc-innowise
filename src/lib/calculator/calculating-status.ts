import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';
import {
  calcPercentage,
  calculatorSmartDisplay,
  normalizeOutput,
  operate,
} from '../utils';

export class CalculatingStatus implements CalcStatus {
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
        calc.state.allClear = false;
        break;
      case 'negate':
        calc.transition(CalculatorStatusEnum.Waiting);
        calc.value = '-0';
        calc.state.allClear = false;
        break;
      case 'operator':
        calc.state.operator = event.value;
        break;
      case 'clear':
        if (calc.state.operand === null || calc.state.value === '0') {
          calc.transition(CalculatorStatusEnum.Idle);
          calc.resetState();
          calc.memory.clear();
          break;
        }
        calc.value = '0';
        calc.state.allClear = true;
        break;
      case 'result':
        result = operate(
          calc.state.value,
          calc.state.operand!,
          calc.state.operator!
        );
        if (result === 'Error') {
          calc.transition(CalculatorStatusEnum.Error);
          calc.value = result;
          calc.state.operand = null;
          calc.state.operator = null;
          break;
        }
        calc.transition(CalculatorStatusEnum.Result);
        calc.state.operand = calc.state.value;
        calc.state.value = result;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        calc.state.allClear = false;
        break;
      case 'percentage':
        if (calc.state.operator === '/' || calc.state.operator === '*') {
          const percentage = calcPercentage(calc.state.value, '1');
          calc.state.value = percentage;
          calc.state.formattedValue = normalizeOutput(
            calculatorSmartDisplay(percentage)
          );
          break;
        }
        percentage = calcPercentage(calc.state.operand!, calc.state.value);
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
        calc.transition(CalculatorStatusEnum.Result);
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
