# Pregnancy Tracker

A simple, open-source pregnancy tracker that calculates gestational age and key dates. Supports multiple conception methods including IVF (with any embryo age), natural conception, and due-date-only input.

## Features

- **"How far along am I?"** — Enter a date and see the gestational age in weeks and days, with a link to a week-by-week guide.
- **"What date will I be _X_ weeks?"** — Enter a week number to find the calendar date.
- **Multiple conception methods** — IVF with 3-day blast, 5-day blast, or any embryo age; natural conception (known LMP); or just the estimated due date.
- **Pure calculation library** — All pregnancy math is in `src/lib/pregnancy.ts` with no UI dependencies, making it easy to test and reuse.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Install & Run

```sh
npm install
npm run develop
```

The site will be available at `http://localhost:8000`.

### Configure Your Pregnancy

Edit the conception details in the component files under `src/@lekoarts/gatsby-theme-cara/components/`. Both `weeks-along.tsx` and `date-for-weeks.tsx` contain a `myConception` object you can update:

```ts
// IVF example (5-day blast transferred on April 18 2023)
const myConception: ConceptionInfo = {
  method: "ivf",
  transferDate: new Date(2023, 3, 18), // month is 0-indexed
  embryoAgeDays: 5,
}

// Natural conception (known last menstrual period)
const myConception: ConceptionInfo = {
  method: "natural",
  lmpDate: new Date(2023, 5, 1),
}

// Due date only (from ultrasound or provider)
const myConception: ConceptionInfo = {
  method: "dueDate",
  dueDate: new Date(2024, 0, 4),
}
```

## Pregnancy Calculation Library

The core logic lives in [`src/lib/pregnancy.ts`](src/lib/pregnancy.ts) and is fully independent of React or Gatsby. Key exports:

| Function | Description |
|---|---|
| `calculateLMP(info)` | Derive the equivalent LMP date from any conception method |
| `gestationalAge(lmp, date)` | Get `{ weeks, days }` for a given date |
| `dateAtWeek(lmp, week)` | Calendar date when a given week starts |
| `dueDate(lmp)` | Estimated due date (40 weeks from LMP) |
| `trimester(weeks)` | Trimester number (1, 2, or 3) |
| `weekGuideUrl(weeks)` | Link to the What to Expect guide for that week |

### How LMP is Derived

All methods convert to an equivalent **Last Menstrual Period (LMP)** date, which is the standard obstetric reference point:

- **IVF**: `LMP = transferDate − (14 + embryoAgeDays)`
- **Natural**: LMP is used directly.
- **Due date**: `LMP = dueDate − 280 days`

## Testing

```sh
npm test
```

Tests are in `src/lib/__tests__/pregnancy.test.ts` and cover all calculation functions, edge cases, and backwards-compatibility with the original hardcoded logic.

## Scripts

| Script | Description |
|---|---|
| `npm run develop` | Start the development server |
| `npm run build` | Build the production site |
| `npm run serve` | Serve the production build locally |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run clean` | Clear the Gatsby cache |

## Tech Stack

- [Gatsby](https://www.gatsbyjs.com/) v5 with the [Cara theme](https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-cara)
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/) for testing
- [Theme UI](https://theme-ui.com/) for styling

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[0BSD](LICENSE)
