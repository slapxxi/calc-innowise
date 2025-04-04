// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
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
      await page.getByTestId('C').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
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
});
