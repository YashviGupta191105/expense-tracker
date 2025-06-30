# React Personal Finance Tracker

A clean, powerful, and modern web application for tracking your personal finances. Built with React and TypeScript, this app helps you monitor your income and expenses with an interactive dashboard, persistent local storage, and advanced filtering.

## Key Features

-   **Track Your Finances**: Easily add, view, and delete income and expense transactions.
-   **Dynamic Dashboard**:
    -   Displays **all** your transactions by default for a complete financial overview.
    -   Features an optional **date-range filter** to analyze your finances over specific periods.
    -   Provides at-a-glance summary cards for Balance, Income, and Expenses that update with your filters.
-   **Portfolio Analysis**: A dedicated page with interactive **doughnut charts** to visualize your spending and income habits by category.
-   **Persistent & Private**: All data is saved securely in your browser's `localStorage`. Nothing is sent to a server, ensuring your financial data remains private.
-   **Type-Safe Codebase**: Built with **TypeScript** for a more robust, maintainable, and error-resistant application.
-   **Modern Tech**: Uses modern React features like Hooks and Context API for efficient and clean state management.

---

## Tech Stack

-   **Frontend:** React.js, **TypeScript**
-   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
-   **Routing:** `react-router-dom`
-   **Charting:** `chart.js` & `react-chartjs-2`
-   **Styling:** Custom CSS

---

## How It Works

The application is built around a centralized state management system using **React Context**.

1.  **`TransactionContext`**: A global provider holds all `transactions` and `loans`, making them available throughout the app without prop-drilling. It also handles saving data to `localStorage` whenever it changes.
2.  **`DashboardPage.tsx`**: This component serves as the main controller. It consumes the transaction data, manages the state for the date filter, and calculates the summary metrics.
3.  **Data Filtering**: By default, all transactions are shown. When a user selects a date range, a `useMemo` hook efficiently re-calculates the list of transactions to display, ensuring fast performance without unnecessary re-renders.
