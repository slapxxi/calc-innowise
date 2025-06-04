const themeList = [
  'default-theme',
  'dracula-theme',
  'solarized-theme',
  'pcalc-theme',
];

const DROPDOWN_SELECTOR = '.dropdown';
const DROPDOWN_LIST_SELECTOR = '.dropdown__list';
const DROPDOWN_LIST_ITEM_SELECTOR = '.dropdown__listItem';
const DROPDOWN_BUTTON_SELECTOR = '.dropdown__btn';
const DROPDOWN_BUTTON_TEXT_SELECTOR = '.dropdown__btn__text';

function themeToClassName(theme: string) {
  return theme.toLowerCase() + '-theme';
}

export class Dropdown {
  private dropdownButton: HTMLElement;
  private dropdownButtonText: HTMLElement;
  private dropdownList: HTMLElement;
  private dropdownListItems: NodeListOf<HTMLElement>;

  constructor() {
    this.dropdownButton = document.querySelector(DROPDOWN_BUTTON_SELECTOR)!;
    this.dropdownButtonText = document.querySelector(
      DROPDOWN_BUTTON_TEXT_SELECTOR
    )!;
    this.dropdownList = document.querySelector(DROPDOWN_LIST_SELECTOR)!;
    this.dropdownListItems = document.querySelectorAll(
      DROPDOWN_LIST_ITEM_SELECTOR
    )!;
    this.addEventHandlers();

    const savedTheme = localStorage.getItem('selectedTheme');

    if (savedTheme) {
      this.dropdownButtonText.textContent = savedTheme;
    }
  }

  private addEventHandlers() {
    document.body.addEventListener('click', this.handleBodyClick);

    this.dropdownButton.addEventListener(
      'click',
      this.handleDropdownButtonClick.bind(this)
    );

    this.dropdownListItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const themeName = target.dataset.value!;
        localStorage.setItem('selectedTheme', themeName);
        document.querySelector(DROPDOWN_BUTTON_TEXT_SELECTOR)!.textContent =
          themeName;
        this.dropdownList.classList.add('hidden');
        document.documentElement.classList.remove(...themeList);
        document.documentElement.classList.add(themeToClassName(themeName));
      });
    });
  }

  private handleBodyClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target?.closest(DROPDOWN_SELECTOR)) {
      document.querySelector(DROPDOWN_LIST_SELECTOR)!.classList.add('hidden');
    }
  }

  private handleDropdownButtonClick() {
    this.dropdownList.classList.toggle('hidden');
  }
}
