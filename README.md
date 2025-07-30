# Recurring Date Picker

A modern, interactive, and highly customizable recurring date picker component built with React. This tool allows users to define complex recurrence patterns (daily, weekly, monthly, yearly) and instantly preview the results on a calendar and in a summary view.

*(Replace the above URL with a screenshot or GIF of your actual project)*

-----

## ✨ Features

  - **Multiple Recurrence Types**: Choose from Daily, Weekly, Monthly, and Yearly recurrence patterns.
  - **Flexible Intervals**: Set intervals for any recurrence type (e.g., "every 3 days" or "every 2 months").
  - **Advanced Weekly Selection**: Select specific days of the week for weekly recurrences.
  - **Complex Monthly Rules**: Configure monthly dates by specific day number (e.g., "the 15th") or by weekday (e.g., "the second Tuesday").
  - **Custom Date Ranges**: Define a start date and set end conditions like "never," "on a specific date," or "after a number of occurrences".
  - **Live Calendar Preview**: Instantly visualize the generated recurring dates on an interactive calendar.
  - **Human-Readable Summary**: A dynamic text summary describes the created pattern in plain English (e.g., "Every 2 weeks on Monday, Wednesday").
  - **Upcoming Dates Display**: See a list of the next 8 upcoming dates based on the current pattern.
  - **Responsive Design**: The layout is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

-----

## 🛠️ Tech Stack

  - **Frontend**: **React.js**
  - **Styling**: **CSS** with Custom Properties (Variables) for easy theming
  - **Build Tool**: **Vite**

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/your-username/recurring-date-picker.git
    ```

2.  **Navigate to the project directory**

    ```sh
    cd recurring-date-picker
    ```

3.  **Install NPM packages**

    ```sh
    npm install
    ```

4.  **Run the development server**

    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

-----

## 🎨 Customization and Styling

The project uses a modern CSS setup with variables for easy customization of the look and feel.

You can modify the core design tokens (colors, fonts, spacing, etc.) in the `:root` block of the **`public/index.css`** file.

For example, to change the main background color of the application, you can simply update the `--color-background` variable:

```css
:root {
  /* ... other variables */
  --color-background: var(--color-cream-50); /* The default background */
}
```

Change it to any other defined color, such as `--color-gray-200` or a custom RGBA value, to instantly update the theme across the entire application.

Component-specific styles can be found in **`src/App.css`**.

-----

## 📂 Project Structure

```
/
├── public/
│   └── vite.svg            # Vite icon
├── src/
│   ├── App.css             # Component-specific styles
│   ├── App.jsx             # Main application component and logic
│   ├── index.css           # Global styles and CSS variables
│   └── main.jsx            # React app entry point
├── .gitignore
├── index.html              # Main HTML entry file
├── package.json
└── README.md
```

-----

## Author
- Abhiraj Singh Jhajj
