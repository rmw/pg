# Pregnancy Tracker

A web app to track gestational age during pregnancy and answer questions like
_"What date will I be 24 weeks?"_ — useful for travel cut-offs, viability
milestones, and general planning.

## Supported Conception Methods

The calculation engine supports several ways to determine gestational age,
so it works no matter how you conceived:

| Method | What you provide | How gestational age is calculated |
|---|---|---|
| **IVF (any embryo age)** | Embryo transfer date + embryo age in days (e.g. 3-day or 5-day blast) | LMP = transfer date − (14 + embryo age) |
| **Natural – LMP** | First day of last menstrual period | Standard dating from LMP |
| **Natural – Conception date** | Date of conception / ovulation | LMP = conception date − 14 |
| **Due date only** | Estimated due date | LMP = due date − 280 |

All methods derive an equivalent LMP (Last Menstrual Period) date and then
use standard obstetric convention (gestational age = days since LMP).

## Quick Start

```bash
npm install
npm run develop
```

The site runs at `http://localhost:8000`.

## Project Structure

```
src/
├── lib/
│   ├── pregnancy.ts              # Pure calculation functions (framework-agnostic)
│   └── __tests__/
│       └── pregnancy.test.ts     # Comprehensive unit tests
└── @lekoarts/gatsby-theme-cara/
    └── components/
        ├── weeks-along.tsx       # Shows gestational age on a given date
        ├── weeks-along-form.tsx  # Date input form → gestational age
        ├── date-for-weeks.tsx    # Shows the date for a given week milestone
        └── date-for-weeks-form.tsx  # Week input form → date
```

### Calculation Library (`src/lib/pregnancy.ts`)

The core logic is in a framework-agnostic TypeScript module with no React
dependencies. You can import and use it in any JavaScript/TypeScript project:

```typescript
import {
  getGestationalAge,
  getDateForWeek,
  getDueDate,
  getLMPDate,
} from "./lib/pregnancy"

// IVF with a 5-day blastocyst transferred on April 18, 2023
const info = { type: "ivf", transferDate: new Date("2023-04-18"), embryoAgeDays: 5 }

// What week am I on today?
const ga = getGestationalAge(info)
console.log(`${ga.weeks} weeks and ${ga.days} days`)

// When will I be 24 weeks?
const date24 = getDateForWeek(info, 24)

// What is my due date?
const due = getDueDate(info)
```

## Running Tests

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Tech Stack

- [Gatsby v5](https://www.gatsbyjs.com/) with the
  [@lekoarts/gatsby-theme-cara](https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-cara) theme
- React 18 + TypeScript
- [Jest](https://jestjs.io/) for testing

## Contributing

Contributions are welcome! Some ideas for future work:

- Add a conception-method selector UI so users can choose their method
- Persist user settings (dates, method) in local storage
- Add trimester / milestone indicators
- Improve date input with a date picker
- Add more comprehensive component-level tests
- Add CI workflow (GitHub Actions)

## License

[0BSD](LICENSE) — free to use for any purpose.
