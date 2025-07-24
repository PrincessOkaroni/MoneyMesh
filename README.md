## MoneyMesh

## Description
MoneyMesh is a personal finance management web application built with React, designed to help users track their income, expenses, and savings. The application provides a user-friendly interface to visualize financial data through cards, a transaction table, and a pie chart for expense statistics. It features a responsive navbar with navigation tabs, a welcome message, and a profile image, ensuring an intuitive user experience. Users can add transactions (income, expenses, savings), filter transactions by time period, and view a breakdown of their expenses by category.


## Features
- Landing Page: Welcomes users with a call-to-action to navigate to the Overview page.
- Navbar: Displays the MoneyMesh logo, project name, - - - - navigation tabs (Overview, Transactions, Budget Planning), welcome message ("Welcome, Purity"), and user profile image.
- Financial Cards: Shows Balance, Total Income, Total Expense, and Total Savings with real-time updates.
- Action Buttons: Allows users to add Income, Expense, or Savings via a modal form.
- Filter Dropdown: Filters transactions by "This Month" (Jul 2025), "Last Month" (Jun 2025), or "Select Period" (all transactions).
- Transaction Table: Displays a table of transactions with columns for Type, Date, Category, Description, and Amount, including a total row.
- Expense Statistics Pie Chart: Visualizes expense distribution (30% Investment and Savings, 25% Bills, 20% General Upkeep, 10% Entertainment, 15% Others) based on income, with interactive tooltips and click events showing category details.
- Modal Form: Enables adding new transactions with fields for amount, category, and description.
- Mock Backend: Uses db.json with JSON Server to simulate a REST API for financial data and transactions.
- Responsive Design: Optimized for both desktop and mobile devices, with a collapsible navbar on smaller screens.
- Error Handling: Includes an error boundary to handle runtime errors gracefully and a 404 page for invalid routes.

## Tech Stack

- Frontend: React, React Router, Chart.js, React-Chartjs-2
- Styling: Custom CSS (no Tailwind CSS)
- Backend: JSON Server (mock API)
- Build Tool: Create React App
- State Management: React Context API

## Project Structure

moneymesh/
├── src/
│   ├── App.jsx                   # Main app component with routing and context
│   ├── App.css                   # Styles for the app container and error pages
│   ├── assets/
│   │   └── moneymesh-logo.png    # Logo image for the navbar
│   ├── Components/
│   │   ├── Overview.jsx          # Overview page with navbar, cards, buttons, table, and pie chart
│   │   ├── Overview.css          # Styles for Overview.jsx
│   │   ├── Transaction.jsx       # Transactions page with navbar, buttons, and table
│   │   ├── Transaction.css       # Styles for Transaction.jsx
│   │   ├── BudgetPlanning.jsx    # Budget Planning page (placeholder) with navbar
│   │   ├── BudgetPlanning.css    # Styles for BudgetPlanning.jsx
│   │   ├── LandingPage.jsx       # Landing page with navbar and welcome message
│   │   ├── LandingPage.css       # Styles for LandingPage.jsx
├── public/
│   ├── index.html                # HTML entry point
│   ├── favicon.ico               # Favicon
│   ├── manifest.json             # Web app manifest
├── db.json                       # Mock backend data for financialData and transactions
├── package.json                  # Project dependencies and scripts
├── README.md                     # Project documentation
├── .eslintrc.json                # ESLint configuration   

## Setup Instructions

Clone the Repository:
git clone `git@github.com:PrincessOkaroni/MoneyMesh.git`
cd moneymesh


Install Dependencies:Ensure Node.js is installed, then run:
`npm install`

This installs required packages: react, react-dom, react-router-dom, chart.js, react-chartjs-2.


Run the Application:Start the development server:
`npm start`

Install JSON Server for the mock backend:

`npm install -g json-server`

Start JSON Server to serve the mock API:

`json-server --watch db.json --port 3001`

- Open http://localhost:3000 in your browser. The app redirects to /landingPage by default.

- Build for Production:Create a production build:
`npm run build`


- Linting:Check for linting issues:
`npm run lint`

- Fix auto-fixable issues:
`npm run lint -- --fix`


## Technologies Used

- React: JavaScript library for building user interfaces.
- React Router: Handles client-side routing for navigation between pages.
- Chart.js & React-Chartjs-2: Renders the interactive pie chart for expense statistics.
- React Context API: Manages shared state for financial data and transactions.
- CSS: Custom styles for responsive design and component styling.
- Create React App: Bootstraps the project with a pre-configured build setup.
- ESLint: Enforces code quality and consistency.

## Authors

Okaroni Purity - Team Lead
Justin Tutu    - Contributor
Paul Ondiek    - Contributor

## License
This project is licensed under the MIT License.