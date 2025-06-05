import { Calculator } from './calculator';
import {
  Power2Command,
  Power3Command,
  Root2Command,
  Root3Command,
  OneDivCommand,
  TenToPowerCommand,
  FactorialCommand,
} from './calculator/commands';
import { Dropdown } from './dropdown';
import { InitializationError } from './errors';
import { CalculatorStatus, Shortcut, type CalculatorEvent } from './types';
import { removeEmptyProperties } from './utils';

export const CONTAINER_SELECTOR = '.calc';
export const OUTPUT_CONTAINER_SELECTOR = '.output-container';
export const MEMORY_CONTAINER_SELECTOR = '.memory-container';
export const MEMORY_TEXT_SELECTOR = '.memory__text';
export const OUTPUT_SELECTOR = '.output__text';
export const CLEAR_BUTTON_SELECTOR = '[data-type="clear"]';

export const BUTTON_ACTIVE_SELECTOR = '.button_active';
export const BUTTON_OP_ADD_SELECTOR = '[data-value="+"]';
export const BUTTON_OP_SUB_SELECTOR = '[data-value="-"]';
export const BUTTON_OP_MUL_SELECTOR = '[data-value="*"]';
export const BUTTON_OP_DIV_SELECTOR = '[data-value="/"]';
export const BUTTON_OP_POW_SELECTOR = '[data-value="**"]';
export const BUTTON_OP_ROOT_SELECTOR = '[data-value="root"]';

export class App {
  containerElement: HTMLDivElement;
  outputContainerElement: HTMLDivElement;
  memoryContainerElement: HTMLDivElement;
  memoryTextElement: HTMLDivElement;
  outputElement: HTMLDivElement;
  clearButtonElement: HTMLButtonElement;

  power2Command: Power2Command;
  power3Command: Power3Command;
  root2Command: Root2Command;
  root3Command: Root3Command;
  tenToPowerCommand: TenToPowerCommand;
  oneDivCommand: OneDivCommand;
  factorialCommand: FactorialCommand;

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
    const memoryContainerElement = document.querySelector<HTMLDivElement>(
      MEMORY_CONTAINER_SELECTOR
    );
    const memoryTextElement =
      document.querySelector<HTMLDivElement>(MEMORY_TEXT_SELECTOR);

    if (
      containerElement &&
      outputContainerElement &&
      outputElement &&
      clearButtonElement &&
      memoryContainerElement &&
      memoryTextElement
    ) {
      this.containerElement = containerElement;
      this.outputContainerElement = outputContainerElement;
      this.outputElement = outputElement;
      this.clearButtonElement = clearButtonElement;
      this.memoryContainerElement = memoryContainerElement;
      this.memoryTextElement = memoryTextElement;

      this.calculator = new Calculator();

      this.power2Command = new Power2Command(this.calculator);
      this.power3Command = new Power3Command(this.calculator);
      this.root2Command = new Root2Command(this.calculator);
      this.root3Command = new Root3Command(this.calculator);
      this.tenToPowerCommand = new TenToPowerCommand(this.calculator);
      this.oneDivCommand = new OneDivCommand(this.calculator);
      this.factorialCommand = new FactorialCommand(this.calculator);

      this.addEventHandlers();
      this.render();
      new Dropdown();
    } else {
      throw new InitializationError('Required elements not found');
    }
  }

  render() {
    this.outputElement.textContent = this.calculator.formattedValue;
    this.memoryTextElement.textContent = this.calculator.memory.getValue();
    this.adjustOutputContainer();
    this.adjustMemoryContainer();
    this.highlightActiveOperator();

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
        case '**':
          el = document.querySelector(BUTTON_OP_POW_SELECTOR);
          break;
        case 'root':
          el = document.querySelector(BUTTON_OP_ROOT_SELECTOR);
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
      this.outputContainerElement.setAttribute('viewBox', '0 0 100 15');
    } else {
      const calculatedWidth = this.calculator.formattedValue.length * 6.25;
      const aspectRatio = 15 / 100;
      this.outputContainerElement.setAttribute(
        'viewBox',
        `0 0 ${calculatedWidth} ${calculatedWidth * aspectRatio}`
      );
    }
  }

  private adjustMemoryContainer() {
    const memoryValue = this.calculator.memory.getValue();

    if (memoryValue !== null) {
      if (memoryValue.length <= 15) {
        this.memoryContainerElement.setAttribute('viewBox', '0 0 100 15');
      } else {
        const calculatedWidth = memoryValue.length * 6.25;
        const aspectRatio = 15 / 100;
        this.memoryContainerElement.setAttribute(
          'viewBox',
          `0 0 ${calculatedWidth} ${calculatedWidth * aspectRatio}`
        );
      }
    }
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    if (target?.dataset) {
      const { type, value } = target.dataset;

      if (type === 'shortcut') {
        const command = this.mapShortcutToCommand(value as Shortcut);
        command.execute();
        this.render();
        return;
      }

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

  private mapShortcutToCommand(value: Shortcut) {
    switch (value) {
      case 'n**2':
        return this.power2Command;
      case 'n**3':
        return this.power3Command;
      case '10**n':
        return this.tenToPowerCommand;
      case 'root2':
        return this.root2Command;
      case 'root3':
        return this.root3Command;
      case '1/n':
        return this.oneDivCommand;
      case 'n!':
        return this.factorialCommand;
      default:
        throw new Error(`Unknown shortcut: ${value}`);
    }
  }
}
