# Calculator App

## Task

[Task](https://docs.google.com/document/d/1zpXXeSae-BlcxPKgw3DhxZA92cspVailrPYoaXSYrW8/edit?pli=1&tab=t.0)

## How to Run the App

Either visit the [deployed version](https://calc-innowise.vercel.app/) or do the following:

To install the necessary dependencies for the project, run the following command:

```
npm install
```

| Command                    | Description                   |
| -------------------------- | ----------------------------- |
| `npm run start`            | Starts the development server |
| `npm run build`            | Creates a production build    |
| `npm test`                 | Runs the test suite           |
| `npm run lint`             | Performs code linting         |
| `npx playwright text --ui` | Launch the testing UI         |

## Technologies Used

- Vanilla JavaScript
- CSS Custom Properties (Variables)
- CSS Grid
- Webpack
- HTML5
- LocalStorage for theme persistence

## Testing

The project includes an extensive end-to-end test suite located in the `e2e/` directory. The main test file `calc.spec.js` contains comprehensive tests covering all calculator functionality:

### Test Coverage

- Basic number input and display
- All arithmetic operations (+, -, \*, /)
- Operator chaining
- Error states (e.g., division by zero)
- Clear/All Clear functionality
- Decimal point handling
- Number negation
- State management
- Button highlighting
- Display formatting

### Running Tests

To run the test suite:

```bash
# Run tests in headless mode
npm test

# Run tests with UI
npx playwright test --ui
```

The test suite uses Playwright for end-to-end testing, providing thorough coverage of user interactions and calculator functionality. Each test case ensures the calculator behaves correctly in various scenarios, from basic arithmetic to edge cases and error handling.

## Project Description

A modern calculator web application built with vanilla JavaScript, featuring multiple themes and a responsive design.

### Key Features

#### Calculator Functions

- Basic arithmetic operations (+, -, \*, /)
- Percentage calculations
- Number negation
- Decimal point support
- Clear/All Clear functionality
- Real-time calculation display

#### Theme System

- Four carefully designed themes:
  - **Default**: Classic calculator look with gray tones and orange accents
  - **Dracula**: Dark theme with vibrant accents, easy on the eyes
  - **PCalc**: Professional calculator theme with blue accents
  - **Solarized**: Popular color scheme optimized for readability
- Theme persistence using LocalStorage
- Live theme preview on hover

#### User Interface

- Responsive grid layout
- Touch-friendly buttons
- Clear visual feedback on button press
- Adaptive sizing for different screen sizes
- Error handling with clear user feedback

#### Technical Highlights

- Core logic built using FSM (finite state machines)
- CSS Grid for precise layout control
- CSS Custom Properties for dynamic theming
- No external UI libraries or frameworks
- Modular code structure for maintainability
