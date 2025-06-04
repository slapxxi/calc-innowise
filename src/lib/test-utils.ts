import { Page } from '@playwright/test';

/**
 * Types a number into the calculator.
 */
export async function typeNumber(page: Page, value: string) {
  const c = value
    .split('')
    .map(mapButtons)
    .map((c) => page.getByTestId(`${c}`));
  for await (const d of c) {
    await d.click();
  }
}

/**
 * Maps a character to the corresponding button test ID.
 */
function mapButtons(c: string) {
  switch (c) {
    case ',':
      return ',';
    default:
      return `button-${c}`;
  }
}
