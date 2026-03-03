# Contributing

Thanks for your interest in contributing to the Pregnancy Tracker!

## Development Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/rmw/pg.git
   cd pg
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start the development server**

   ```sh
   npm run develop
   ```

   The site will be available at `http://localhost:8000`.

4. **Run the tests**

   ```sh
   npm test
   ```

## Project Structure

```
src/
├── lib/
│   ├── pregnancy.ts              # Pure calculation functions (no UI deps)
│   └── __tests__/
│       └── pregnancy.test.ts     # Comprehensive test suite
├── @lekoarts/gatsby-theme-cara/
│   └── components/
│       ├── weeks-along.tsx       # "How far along" display component
│       ├── weeks-along-form.tsx  # Form for entering a date
│       ├── date-for-weeks.tsx    # "Date at week X" display component
│       └── date-for-weeks-form.tsx  # Form for entering a week number
└── pages/
    └── 404.jsx                   # 404 page
```

## Guidelines

- **Keep calculation logic in `src/lib/pregnancy.ts`** — this file contains pure functions with no React/Gatsby dependencies, making it easy to test and reuse.
- **Add tests for new logic** — any new calculation or conception method should have corresponding tests in `src/lib/__tests__/pregnancy.test.ts`.
- **Run `npm test` before submitting** — all tests must pass.

## Adding a New Conception Method

1. Add a new interface to the `ConceptionInfo` union type in `src/lib/pregnancy.ts`.
2. Add the LMP derivation logic to the `calculateLMP` function.
3. Add tests covering the new method in `src/lib/__tests__/pregnancy.test.ts`.
4. Update the component files if needed.
