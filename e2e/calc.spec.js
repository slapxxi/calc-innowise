// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test.describe('pressing digits', () => {
    test('pressing 1', async ({ page }) => {
      await page.getByTestId('button-1').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('1');
    });

    test('pressing 2', async ({ page }) => {
      await page.getByTestId('button-2').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('2');
    });

    test('pressing 3', async ({ page }) => {
      await page.getByTestId('button-3').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('3');
    });

    test('pressing 4', async ({ page }) => {
      await page.getByTestId('button-4').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('4');
    });

    test('pressing 5', async ({ page }) => {
      await page.getByTestId('button-5').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('5');
    });

    test('pressing 6', async ({ page }) => {
      await page.getByTestId('button-6').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('6');
    });

    test('pressing 7', async ({ page }) => {
      await page.getByTestId('button-7').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('7');
    });

    test('pressing 8', async ({ page }) => {
      await page.getByTestId('button-8').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('8');
    });

    test('pressing 9', async ({ page }) => {
      await page.getByTestId('button-9').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('9');
    });

    test('pressing 0', async ({ page }) => {
      await page.getByTestId('button-0').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('pressing multiple digits', async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('button-7').click();
      await page.getByTestId('button-8').click();
      await page.getByTestId('button-9').click();
      await page.getByTestId('button-0').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('1234567890');
    });
  });

  test.describe('when there is no input', () => {
    test('displays 0 as initial value', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test('clear button has AC text', async ({ page }) => {
      const clear = page.getByTestId('C');
      await expect(clear).toHaveText('AC');
    });

    test('pressing clear does nothing', async ({ page }) => {
      await page.getByTestId('C').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

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

    test('pressing zero does nothing', async ({ page }) => {
      await page.getByTestId('button-0').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
    });

    test.describe('pressing operators', () => {
      test.describe('pressing /', () => {
        let button;

        test.beforeEach(async ({ page }) => {
          button = page.getByTestId('/');
          await button.click();
        });

        test('highlights button', async () => {
          await expect(button).toHaveClass(/button_active/);
        });

        test('does not change clear button to C', async ({ page }) => {
          const clear = page.getByTestId('C');
          await expect(clear).toHaveText('AC');
        });

        test('results in Error', async ({ page }) => {
          await page.getByTestId('=').click();
          const output = page.getByTestId('output');
          await expect(output).toHaveText('Error');
          await expect(button).not.toHaveClass(/button_active/);
        });

        test('clears highlight', async ({ page }) => {
          await page.getByTestId('C').click();
          await expect(button).not.toHaveClass(/button_active/);
        });
      });

      test.describe('pressing *', () => {
        let button;

        test.beforeEach(async ({ page }) => {
          button = page.getByTestId('*');
          await button.click();
        });

        test('highlights button', async () => {
          await expect(button).toHaveClass(/button_active/);
        });

        test('does not change clear button to C', async ({ page }) => {
          const clear = page.getByTestId('C');
          await expect(clear).toHaveText('AC');
        });

        test('results in 0', async ({ page }) => {
          await page.getByTestId('=').click();
          const output = page.getByTestId('output');
          await expect(output).toHaveText('0');
          await expect(button).not.toHaveClass(/button_active/);
        });

        test('clears highlight', async ({ page }) => {
          await page.getByTestId('C').click();
          await expect(button).not.toHaveClass(/button_active/);
        });
      });

      test.describe('pressing -', () => {
        let button;

        test.beforeEach(async ({ page }) => {
          button = page.getByTestId('-');
          await button.click();
        });

        test('highlights button', async () => {
          await expect(button).toHaveClass(/button_active/);
        });

        test('does not change clear button to C', async ({ page }) => {
          const clear = page.getByTestId('C');
          await expect(clear).toHaveText('AC');
        });

        test('results in 0', async ({ page }) => {
          await page.getByTestId('=').click();
          const output = page.getByTestId('output');
          await expect(output).toHaveText('0');
          await expect(button).not.toHaveClass(/button_active/);
        });

        test('clears highlight', async ({ page }) => {
          await page.getByTestId('C').click();
          await expect(button).not.toHaveClass(/button_active/);
        });
      });

      test.describe('pressing +', () => {
        let button;

        test.beforeEach(async ({ page }) => {
          button = page.getByTestId('+');
          await button.click();
        });

        test('highlights button', async () => {
          await expect(button).toHaveClass(/button_active/);
        });

        test('does not change clear button to C', async ({ page }) => {
          const clear = page.getByTestId('C');
          await expect(clear).toHaveText('AC');
        });

        test('results in 0', async ({ page }) => {
          await page.getByTestId('=').click();
          const output = page.getByTestId('output');
          await expect(output).toHaveText('0');
          await expect(button).not.toHaveClass(/button_active/);
        });

        test('clears highlight', async ({ page }) => {
          await page.getByTestId('C').click();
          await expect(button).not.toHaveClass(/button_active/);
        });
      });
    });

    test.describe('pressing negate', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('+-').click();
      });

      test('negates output', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('-0');
      });

      test('negates back to 0 when pressed again', async ({ page }) => {
        await page.getByTestId('+-').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('0');
      });

      test('negates following number', async ({ page }) => {
        await page.getByTestId('button-1').click();
        await page.getByTestId('button-2').click();
        await page.getByTestId('button-3').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('-123');
        await page.getByTestId('+-').click();
        await expect(output).toHaveText('123');
      });
    });

    test.describe('pressing comma', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId(',').click();
      });

      test('adds comma', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('0,');
      });

      test('changes clear button to C', async ({ page }) => {
        const clear = page.getByTestId('C');
        await expect(clear).toHaveText('C');
      });

      test('pressing again does nothing', async ({ page }) => {
        await page.getByTestId(',').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('0,');
      });
    });
  });

  test.describe('when a single number entered', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-1').click();
      await page.getByTestId('button-2').click();
      await page.getByTestId('button-3').click();
    });

    test('displays number', async ({ page }) => {
      const output = page.getByTestId('output');
      await expect(output).toHaveText('123');
    });

    test('pressing clear clears display', async ({ page }) => {
      const clear = page.getByTestId('C');
      await clear.click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0');
      await expect(clear).toHaveText('AC');
    });

    test('pressing negate negates number', async ({ page }) => {
      await page.getByTestId('+-').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-123');
      await page.getByTestId('+-').click();
      await expect(output).toHaveText('123');
    });

    test('pressing percentage produces correct result', async ({ page }) => {
      await page.getByTestId('%').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('1,23');
      await page.getByTestId('%').click();
      await expect(output).toHaveText('0,0123');
    });

    test('divides with other number', async ({ page }) => {
      await page.getByTestId('/').click();
      await expect(page.getByTestId('/')).toHaveClass(/button_active/);
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,26973684');
    });

    test('multiplies with other number', async ({ page }) => {
      await page.getByTestId('*').click();
      await expect(page.getByTestId('*')).toHaveClass(/button_active/);
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('56088');
    });

    test('sums with other number', async ({ page }) => {
      await page.getByTestId('+').click();
      await expect(page.getByTestId('+')).toHaveClass(/button_active/);
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('579');
    });

    test('subtracts with other number', async ({ page }) => {
      await page.getByTestId('-').click();
      await expect(page.getByTestId('-')).toHaveClass(/button_active/);
      await page.getByTestId('button-4').click();
      await page.getByTestId('button-5').click();
      await page.getByTestId('button-6').click();
      await page.getByTestId('=').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('-333');
    });

    test.describe('pressing result', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('=').click();
      });

      test('produces correct result', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('123');
      });

      test('pressing again produces same result', async ({ page }) => {
        await page.getByTestId('=').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('123');
      });
    });

    test.describe('pressing comma', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId(',').click();
      });

      test('adds comma', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('123,');
      });

      test('pressing multiple times does not add multiple commas', async ({
        page,
      }) => {
        await page.getByTestId(',').click();
        await page.getByTestId(',').click();
        await page.getByTestId(',').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('123,');
      });

      test('pressing digits after, adds digits after comma', async ({
        page,
      }) => {
        await page.getByTestId(',').click();
        await page.getByTestId('button-4').click();
        await page.getByTestId('button-5').click();
        await page.getByTestId('button-6').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('123,456');
      });
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

    test.describe('pressing clear', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('C').click();
      });

      test('clears value', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('0');
      });

      test('changes clear button to AC', async ({ page }) => {
        const clear = page.getByTestId('C');
        await expect(clear).toHaveText('AC');
      });

      test('operator stays highlighted', async ({ page }) => {
        await expect(page.getByTestId('+')).toHaveClass(/button_active/);
      });

      test('pressing result produces correct result', async ({ page }) => {
        await page.getByTestId('=').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('120');
        await page.getByTestId('=').click();
        await expect(output).toHaveText('120');
      });
    });

    test.describe('pressing negate', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('+-').click();
      });

      test('negates value', async ({ page }) => {
        const output = page.getByTestId('output');
        await expect(output).toHaveText('-120');
      });

      test('pressing again negates back to positive', async ({ page }) => {
        await page.getByTestId('+-').click();
        const output = page.getByTestId('output');
        await expect(output).toHaveText('120');
      });
    });

    test('pressing percentage produces correct result', async ({ page }) => {
      await page.getByTestId('%').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('1,2');
      await page.getByTestId('%').click();
      await expect(output).toHaveText('0,012');
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

    test('pressing comma results in adding new value', async ({ page }) => {
      await page.getByTestId(',').click();
      const output = page.getByTestId('output');
      await expect(output).toHaveText('0,');
      await expect(page.getByTestId('+')).not.toHaveClass(/button_active/);
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
