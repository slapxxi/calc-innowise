import { Calculator } from './calculator';
import { Dropdown } from './dropdown';
import { InitializationError } from './errors';
import { CalculatorStatus, type CalculatorEvent } from './types';
import { removeEmptyProperties } from './utils';

export const CONTAINER_SELECTOR = '.calc';
export const OUTPUT_CONTAINER_SELECTOR = '.output';
export const OUTPUT_SELECTOR = '.output__text';
export const CLEAR_BUTTON_SELECTOR = '[data-type="clear"]';

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

    // todo: fix this
    if (this.calculator.formattedValue === '0') {
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
    if (this.calculator.is(CalculatorStatus.Calculating)) {
      // todo: implement
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
