// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test.describe('when there is no input', () => {
    test('pressing result does nothing', async ({ page }) => {
      await page.getByTestId('=').click();
      const clear = page.getByTestId('C');
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
    });

    test('pressing percentage does nothing', async ({ page }) => {
      await page.getByTestId('%').click();
      const output = page.getByTestId('output');
      const clear = page.getByTestId('C');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
    });

    test('pressing comma adds comma', async ({ page }) => {
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,');
    });

    test('pressing operator highlights operator button', async ({ page }) => {
      await page.getByTestId('+').click();
      const button = page.getByTestId('+');
      await expect(button).toHaveClass(/button_active/);
    });

    test('pressing operator then result resets', async ({ page }) => {
      await page.getByTestId('*').click();
      await page.getByTestId('=').click();
      const button = page.getByTestId('*');
      await expect(button).not.toHaveClass(/button_active/);
    });

    test('pressing comma changes clear button to C', async ({ page }) => {
      await page.getByTestId(',').click();
      const clear = page.getByTestId('C');
      await expect(clear).toHaveText('C');
    });

    test('displays 0 as initial value', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('pressing negate adds minus', async ({ page }) => {
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-0');
    });

    test('pressing negate twice removes negative sign', async ({ page }) => {
      await page.getByTestId('+-').click();
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('pressing digits after negate makes number negative', async ({
      page,
    }) => {
      await page.getByTestId('+-').click();
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-123');
    });

    test('pressing negate after pressing digit makes number positive', async ({
      page,
    }) => {
      await page.getByTestId('+-').click();
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123');
    });

    test('pressing negate after pressing negate returns to 0 ', async ({
      page,
    }) => {
      await page.getByTestId('+-').click();
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('clear button has AC text', async ({ page }) => {
      const clear = page.getByTestId('C');
      await expect(clear).toHaveText('AC');
    });

    test('pressing zero does nothing', async ({ page }) => {
      await page.getByTestId('button-0').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('pressing clear does nothing', async ({ page }) => {
      await page.getByTestId('C').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('adds comma when pressing comma', async ({ page }) => {
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,');
    });

    test('pressing percentage does nothing', async ({ page }) => {
      await page.getByTestId('%').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('dividing by zero produces error', async ({ page }) => {
      await page.getByTestId('/').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('Error');
    });
  });

  test.describe('when number entered', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
    });

    test('enters other number after + operator', async ({ page }) => {
      await page.getByTestId('+').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('456');
    });

    test('sums with other number', async ({ page }) => {
      await page.getByTestId('+').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
    });

    test('subtracts with other number', async ({ page }) => {
      await page.getByTestId('-').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-333');
    });

    test('multiplies with other number', async ({ page }) => {
      await page.getByTestId('*').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('56088');
    });

    test('divides with other number', async ({ page }) => {
      await page.getByTestId('/').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,26973684');
    });

    test('pressing clear clears display', async ({ page }) => {
      const clear = page.getByTestId('C');
      await clear.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
    });

    test('displays number', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123');
    });

    test('pressing comma adds comma', async ({ page }) => {
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123,');
    });

    test('pressing comma multiple times does not add multiple commas', async ({
      page,
    }) => {
      await page.getByTestId(',').click();
      await page.getByTestId(',').click();
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123,');
    });

    test('pressing digits after adding comma adds digits after comma', async ({
      page,
    }) => {
      await page.getByTestId(',').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123,456');
    });

    test('pressing + highlights + button', async ({ page }) => {
      await page.getByTestId('+').click();
      const button = page.getByTestId('+');
      await expect(button).toHaveClass(/button_active/);
    });

    test('pressing - highlights - button', async ({ page }) => {
      await page.getByTestId('-').click();
      const button = page.getByTestId('-');
      await expect(button).toHaveClass(/button_active/);
    });

    test('pressing * highlights * button', async ({ page }) => {
      await page.getByTestId('*').click();
      const button = page.getByTestId('*');
      await expect(button).toHaveClass(/button_active/);
    });

    test('pressing / highlights / button', async ({ page }) => {
      await page.getByTestId('/').click();
      const button = page.getByTestId('/');
      await expect(button).toHaveClass(/button_active/);
    });
  });

  test.describe('float numbers', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(',').click();
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
    });

    test('displays float number', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,123');
    });

    test('truncates float number to 8 decimals', async ({ page }) => {
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('button-7').click();
      await page.getByTestId('button-8').click();
      await page.getByTestId('button-9').click();
      await page.getByTestId('button-0').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,12345678');
    });
  });

  test.describe('when comma is pressed', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(',').click();
    });

    test('adds digit', async ({ page }) => {
      await page.getByTestId('button-1').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,1');
    });

    test('adds multiple digits', async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,123');
    });

    test('adds multiple digits and negates', async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-0,123');
    });

    test('does nothing when pressing comma again', async ({ page }) => {
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,');
    });
  });

  test.describe('when operator is pressed', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-0').click();
      await page.getByTestId('+').click();
    });

    test('can change operator', async ({ page }) => {
      await page.getByTestId('-').click();
      const button = page.getByTestId('-');
      await expect(button).toHaveClass(/button_active/);
    });

    test('changing operator produces correct result', async ({ page }) => {
      await page.getByTestId('*').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('14400');
    });

    test('pressing result produces correct result', async ({ page }) => {
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('240');
    });

    test('pressing result multiple times repeats the operation', async ({
      page,
    }) => {
      await page.getByTestId('=').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('360');
    });
  });

  test.describe('when two values entered', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('+').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
    });

    test('produces correct result', async ({ page }) => {
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
    });

    test('pressing operator produces result', async ({ page }) => {
      await page.getByTestId('-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
    });

    test('pressing clear clears value', async ({ page }) => {
      const clear = page.getByTestId('C');
      await clear.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('pressing clear clears only one value', async ({ page }) => {
      const clear = page.getByTestId('C');
      await clear.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
      await expect(page.getByTestId('+')).toHaveClass(/button_active/);
    });
  });

  test.describe('when result is produced', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('+').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
    });

    test('displays correct value', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
    });

    test('entering number displays the number', async ({ page }) => {
      await page.getByTestId('button-7').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('7');
    });

    test('pressing result again repeats the operation', async ({ page }) => {
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('1035');
    });

    test('pressing clear clears values', async ({ page }) => {
      const clear = page.getByTestId('C');
      await clear.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
    });

    test('pressing negate negates the result', async ({ page }) => {
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-579');
      await page.getByTestId('+-').click();
      await expect(output).toHaveText('579');
    });

    test('pressing operator produces result', async ({ page }) => {
      let op = page.getByTestId('+');
      await op.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
      await expect(op).toHaveClass(/button_active/);
    });

    test('pressing percentage produces correct result', async ({ page }) => {
      await page.getByTestId('%').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('5,79');
      await page.getByTestId('%').click();
      await expect(output).toHaveText('0,0579');
    });
  });

  test.describe('when chaining operators', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-0').click();
      await page.getByTestId('button-0').click();
      await page.getByTestId('+').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-0').click();
    });

    test('pressing operator produces result', async ({ page }) => {
      await page.getByTestId('+').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('+').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('155');
    });
  });
});
