# Pregnancy Tracker

A configurable pregnancy week tracker that supports multiple conception types including IVF and natural conception.

## Features

- **"How many weeks am I?"** — enter a date to see weeks and days along
- **"When is week X?"** — enter a week number to see the date
- **Milestone cards** — see key dates (trimesters, due date)
- **Configurable** — set your conception type and date in a config file
- **Multiple conception types** — LMP, natural, IVF fresh, IVF 3-day, IVF 5-day, IVF 6-day

## Quick Start

1. Clone this repo
2. Copy the example config and edit with your details:
   ```bash
   cp pregnancy.config.example.json pregnancy.config.json
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run develop
   ```

## Configuration

Edit `pregnancy.config.json` at the project root:

```json
{
  "conceptionType": "ivf-5day",
  "date": "2023-04-18",
  "milestones": [
    { "label": "Second Trimester", "weeks": 14 },
    { "label": "Third Trimester", "weeks": 28 },
    { "label": "39 Weeks", "weeks": 39 },
    { "label": "Due Date", "weeks": 40 }
  ]
}
```

### Conception Types

| Type | `conceptionType` | `date` field | Description |
|------|-------------------|--------------|-------------|
| Last Menstrual Period | `lmp` | First day of last period | Standard medical dating |
| Natural conception | `natural` | Estimated conception date | Known ovulation/intercourse date |
| IVF fresh transfer | `ivf-fresh` | Egg retrieval date | Same timing as natural conception |
| IVF 3-day embryo | `ivf-3day` | Embryo transfer date | 3-day embryo transfer |
| IVF 5-day blastocyst | `ivf-5day` | Embryo transfer date | 5-day blastocyst transfer |
| IVF 6-day blastocyst | `ivf-6day` | Embryo transfer date | 6-day blastocyst transfer |

### How the Math Works

All conception methods are converted to an equivalent **LMP (Last Menstrual Period)** date. From LMP, everything is standard:

- **Weeks along** = (current date − LMP) ÷ 7
- **Due date** = LMP + 280 days (40 weeks)

The LMP equivalent is calculated by subtracting an offset from the provided date:

| Type | Offset | Formula |
|------|--------|---------|
| LMP | 0 days | LMP = date directly |
| Natural / IVF fresh | 14 days | LMP = date − 14 |
| IVF 3-day | 17 days | LMP = transfer date − (14 + 3) |
| IVF 5-day | 19 days | LMP = transfer date − (14 + 5) |
| IVF 6-day | 20 days | LMP = transfer date − (14 + 6) |

The 14-day offset accounts for the ~2 weeks between LMP and ovulation/conception in standard pregnancy dating.

### Milestones

Milestones are optional. If omitted, these defaults are used:

- Second Trimester (week 14)
- Third Trimester (week 28)
- 39 Weeks
- Due Date (week 40)

## Development

```bash
npm run develop    # Start dev server
npm test           # Run tests
npm run build      # Production build
```

## Built With

- [Gatsby](https://www.gatsbyjs.com/) with the [Cara theme](https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-cara)
- TypeScript for type-safe pregnancy calculations
- Jest for testing

## License

0BSD
