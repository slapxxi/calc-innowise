import { Calculator } from '../calculator';
import { CalcStatus, CalculatorEvent, CalculatorStatusEnum } from '../types';
import {
  calcPercentage,
  calculatorSmartDisplay,
  negate,
  normalizeOutput,
  operate,
  truncateNumber,
} from '../utils';

export class WaitingForInputStatus implements CalcStatus {
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
        // special case of -0 like in iOS calculator
        if (calc.state.value === '-0') {
          calc.value = '-' + event.value;
          calc.state.allClear = false;
          break;
        }
        calc.value =
          calc.state.value === '0'
            ? event.value
            : truncateNumber(calc.state.value + event.value);
        break;
      case 'clear':
        if (calc.state.operand === null) {
          calc.transition(CalculatorStatusEnum.Idle);
          calc.value = '0';
          calc.state.operator = null;
          calc.state.operand = null;
          calc.state.allClear = true;
          calc.memory.clear();
          break;
        }
        calc.transition(CalculatorStatusEnum.Calculating);
        calc.value = '0';
        calc.state.allClear = true;
        break;
      case 'percentage':
        if (
          calc.state.operand === null ||
          calc.state.operator === '*' ||
          calc.state.operator === '/'
        ) {
          const percentage = calcPercentage(calc.state.value, '1');
          calc.state.value = percentage;
          calc.state.formattedValue = normalizeOutput(
            calculatorSmartDisplay(percentage)
          );
          break;
        }
        percentage = calcPercentage(calc.state.operand, calc.state.value);
        calc.state.value = percentage;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(percentage)
        );
        break;
      case 'comma':
        if (calc.state.value.includes('.')) {
          break;
        }
        calc.value = calc.state.value + '.';
        break;
      case 'operator':
        if (calc.state.operator === null) {
          calc.transition(CalculatorStatusEnum.Calculating);
          calc.state.operator = event.value;
          calc.state.operand = calc.state.value;
          break;
        }
        result = operate(
          calc.state.operand!,
          calc.state.value,
          calc.state.operator
        );
        if (result === 'Error' || result === 'Infinity') {
          calc.transition(CalculatorStatusEnum.Idle);
          calc.value = result;
          calc.state.operand = null;
          calc.state.operator = null;
          break;
        }
        calc.transition(CalculatorStatusEnum.Calculating);

        calc.state.value = result;
        calc.state.formattedValue = normalizeOutput(
          calculatorSmartDisplay(result)
        );
        calc.state.operand = result;
        calc.state.operator = event.value;
        break;
      case 'result':
        if (calc.state.operand === null) {
          break;
        }
        result = operate(
          calc.state.operand!,
          calc.state.value,
          calc.state.operator!
        );
        if (result === 'Error' || result === 'Infinity') {
          calc.transition(CalculatorStatusEnum.Error);
          calc.value = result;
          calc.state.operand = null;
          calc.state.operator = null;
          calc.state.allClear = true;
          break;
        }
        calc.transition(CalculatorStatusEnum.Result);
        calc.state.operand = calc.state.value;
        calc.value = calculatorSmartDisplay(result);
        break;
      case 'negate':
        calc.value = negate(calc.state.value);
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
