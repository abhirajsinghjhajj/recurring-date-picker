# 📅 Recurring Date Picker

A React + Zustand + TailwindCSS component library that allows users to configure and preview recurring date rules using the `rrule` library.

## ✨ Features

- Select frequency (Daily, Weekly, Monthly, Yearly)
- Choose custom intervals (e.g., every 2 weeks)
- Set date ranges (start and end)
- Customize weekday/monthly patterns
- Live calendar preview of recurring dates
- Console export of RRULE string and next 10 occurrences
- TailwindCSS styled, responsive, and modular UI

---

## 🧱 Project Structure

```
src/
├── app/
│ ├── components/
│ │ ├── RecurringDatePicker.js
│ │ ├── RecurrenceOptions.js
│ │ ├── WeeklySelector.js
│ │ ├── MonthlySelector.js
│ │ ├── DateRangeSelector.js
│ │ ├── CalendarPreview.js
│ │ └── OccurrencesList.js
│ ├── styles/
│ │ └── datePickerStyles.css
│ ├── page.js
│ └── layout.js
├── store/
│ └── useRecurrenceStore.js
├── utils/
│ └── rruleHelper.js
├── globals.css
├── tailwind.config.js
├── postcss.config.mjs
└── tests/
├── RecurrenceOptions.test.js
├── RecurringDatePicker.test.js
└── rruleHelper.test.js
```


---

## 🛠️ Tech Stack

- **React (Functional Components)**
- **Zustand** (Global store management)
- **Tailwind CSS** (UI styling)
- **RRule.js** (Recurrence rule parsing & generation)
- **Jest + React Testing Library** (Unit + Integration testing)
- **Next.js** (App layout and routing)

---

## 🧪 Running Tests

```bash
npm test
