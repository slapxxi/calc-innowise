import { Calculator } from './calculator';
import { Dropdown } from './dropdown';
import { InitializationError } from './errors';
import { CalculatorStatus, type CalculatorEvent } from './types';
import { removeEmptyProperties } from './utils';

export const CONTAINER_SELECTOR = '.calc';
export const OUTPUT_CONTAINER_SELECTOR = '.output';
export const OUTPUT_SELECTOR = '.output__text';
export const CLEAR_BUTTON_SELECTOR = '[data-type="clear"]';

export const BUTTON_ACTIVE_SELECTOR = '.button_active';
export const BUTTON_OP_ADD_SELECTOR = '[data-value="+"]';
export const BUTTON_OP_SUB_SELECTOR = '[data-value="-"]';
export const BUTTON_OP_MUL_SELECTOR = '[data-value="*"]';
export const BUTTON_OP_DIV_SELECTOR = '[data-value="/"]';

export class App {
  containerElement: HTMLDivElement;
  outputContainerElement: HTMLDivElement;
  outputElement: HTMLDivElement;
  clearButtonElement: HTMLButtonElement;

  calculator: Calculator;

  constructor() {
    const containerElement =
      document.querySelector<HTMLDivElement>(CONTAINER_SELECTOR);
    const outputContainerElement = document.querySelector<HTMLDivElement>(
      OUTPUT_CONTAINER_SELECTOR
    );
    const outputElement =
      document.querySelector<HTMLDivElement>(OUTPUT_SELECTOR);
    const clearButtonElement = document.querySelector<HTMLButtonElement>(
      CLEAR_BUTTON_SELECTOR
    );

    if (
      containerElement &&
      outputContainerElement &&
      outputElement &&
      clearButtonElement
    ) {
      this.containerElement = containerElement;
      this.outputContainerElement = outputContainerElement;
      this.outputElement = outputElement;
      this.clearButtonElement = clearButtonElement;

      this.calculator = new Calculator();

      this.addEventHandlers();
      this.render();
      new Dropdown();
    } else {
      throw new InitializationError('Required elements not found');
    }
  }

  render() {
    this.outputElement.textContent = this.calculator.formattedValue;
    this.adjustOutputContainer();
    this.highlightActiveOperator();

    // todo: fix this since it's quite fragile
    // incorrect behavior if the value is just 0 but the state is not idle etc
    if (this.calculator.isAllClear) {
      this.changeClearButtonText('AC');
    } else {
      this.changeClearButtonText('C');
    }
  }

  addEventHandlers() {
    this.containerElement.addEventListener('click', this.handleClick);
  }

  removeEventHandlers() {
    this.containerElement.removeEventListener('click', this.handleClick);
  }

  private highlightActiveOperator() {
    document
      .querySelector(BUTTON_ACTIVE_SELECTOR)
      ?.classList.remove('button_active');

    if (this.calculator.is(CalculatorStatus.Calculating)) {
      let el;
      switch (this.calculator.operator) {
        case '*':
          el = document.querySelector(BUTTON_OP_MUL_SELECTOR);
          break;
        case '-':
          el = document.querySelector(BUTTON_OP_SUB_SELECTOR);
          break;
        case '+':
          el = document.querySelector(BUTTON_OP_ADD_SELECTOR);
          break;
        case '/':
          el = document.querySelector(BUTTON_OP_DIV_SELECTOR);
          break;
        default:
          return;
      }
      el?.classList.add('button_active');
    }
  }

  private changeClearButtonText(text: string) {
    this.clearButtonElement.textContent = text;
  }

  private adjustOutputContainer() {
    if (this.calculator.formattedValue.length <= 15) {
      this.outputContainerElement.setAttribute('viewBox', '0 0 100 30');
    } else {
      const calculatedWidth = this.calculator.formattedValue.length * 6.25;
      const aspectRatio = 30 / 100;
      this.outputContainerElement.setAttribute(
        'viewBox',
        `0 0 ${calculatedWidth} ${calculatedWidth * aspectRatio}`
      );
    }
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    if (target?.dataset) {
      const { type, value } = target.dataset;

      if (type) {
        const calcEvent = removeEmptyProperties({
          type,
          value,
        } as unknown as CalculatorEvent);
        this.calculator.send(calcEvent);
        this.render();
      }
    }
  };
}
