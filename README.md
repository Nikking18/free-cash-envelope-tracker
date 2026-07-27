# Free Cash Envelope Tracker

> Private, zero-login digital cash stuffing application for effortless budget control.

**Live Demo**: [https://freecashtracker.online](https://freecashtracker.online)

---

## Overview

Free Cash Envelope Tracker is a clean, modern, browser-based personal finance application designed for anyone who practices or wants to try the "cash-stuffing" envelope budgeting method digitally. It requires no user accounts, zero sign-ups, and connects to no bank accounts. All budget data is saved strictly inside your browser's local storage (`localStorage`), giving you 100% privacy, instant performance, and complete control over your money.

---

## Features

- **Envelope Management (CRUD)**: Create, edit, and delete named cash envelopes with assigned categories (`Essential`, `Discretionary`, `Savings`, `Debt`), target allocation amounts, and custom color accents.
- **Real-Time Expense Logging**: Record spending transactions against specific envelopes with custom dates, vendor descriptions, and notes.
- **Live Visual Progress & Alerts**: Monitor real-time spending progress bars per envelope and across your total budget. Instant visual badges highlight over-budget states when spending exceeds allocated amounts.
- **Two PDF Export Templates**:
  - **Classic Minimal**: Clean off-white design featuring color-coded metric cards, dark headers, and high-contrast tables.
  - **Minimal B&W**: Print-friendly pure black-and-white layout with individual envelope ledger tables and blank ruled lines for manual home printing.
- **Excel Import & Export**: Download a structured 2-sheet Excel template (`Envelopes` and `Expenses`), validate and import existing spreadsheets (replace-only mode with validation), or export full budget reports to `.xlsx`.
- **Budget Period & Notes**: Define custom budget period labels (e.g., "August 2026" or "Jul 26 – Aug 9") and track budget notes.
- **Configurable Backup Reminders**: Set automated local backup reminders (Every 3 days, Weekly, Every 2 weeks, Monthly, or Never) with a gentle reminder banner when an export is due.
- **Ko-fi Support Integration**: Optional creator support button in the footer and floating overlay.
- **Data-Loss Disclosure Modal**: Upfront disclosure on initial load ensuring users understand that data lives strictly in local browser storage.

---

## How to Use

1. **Create Cash Envelopes**: Click **"+ New Envelope"** in the **Budget Overview** toolbar to set up your budget categories and spending limits (e.g., Groceries $450, Gas $150).
2. **Log Transactions**: Click **"+ Log Expense"** whenever you make a purchase to deduct funds from the corresponding envelope.
3. **Track Balances**: Monitor live remaining balances, progress bars, and over-budget warnings in real time.
4. **Export Reports**: Click the **"Export"** dropdown in the Budget Overview toolbar to download a **PDF** (choose Classic or Minimal B&W style) or an **Excel** backup file.
5. **Import Spreadsheets**: Click **"Import"** in the Budget Overview toolbar to upload a previously saved Excel budget file.

---

## Important Disclaimers

> **Data Privacy Notice**: All data is stored strictly in your browser's `localStorage`. Clearing browser cache or switching devices will erase local data. Regularly export a PDF or Excel backup to preserve your records.

- **No Cloud Sync or Accounts**: There is no backend database, cloud storage, or multi-device synchronization.
- **Not Financial Advice**: Free Cash Envelope Tracker is a personal budget planning tool. It does not provide professional financial, legal, or accounting advice.
- **No Warranty**: The software is provided "as is", without warranty of any kind.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: `jsPDF` & `jspdf-autotable` (lazy-loaded on export)
- **Excel Processing**: `xlsx` / SheetJS (lazy-loaded on import/export)
- **Storage**: Browser `localStorage`

---

## Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Nikking18/free-cash-envelope-tracker.git
cd free-cash-envelope-tracker

# Install dependencies
npm install

# Start development server on http://localhost:3000
npm run dev

# Build for production
npm run build
```

---

## Deployment

This application is deployed on **Vercel** with a custom domain configured at [https://freecashtracker.online](https://freecashtracker.online).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Credits

Created with ❤️ by Nikhil
