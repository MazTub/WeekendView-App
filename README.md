# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Main Application Structure

App.jsx - The main application component that orchestrates the navigation and renders the appropriate views
WeekendContext.jsx - A context provider that manages the shared state across components

Layout Components

Header.jsx - The top navigation bar with title and action icons
BottomNav.jsx - The bottom tab bar for primary navigation
SideDrawer.jsx - The side drawer menu accessible via the hamburger icon
FloatingActionButton.jsx - The FAB with submenu for primary creation actions

View Components

Dashboard.jsx - The home view showing an overview of plans
PlansOverview.jsx - The plans view showing all months in a year
MonthView.jsx - View for a specific month's weekends
WeekendDetailView.jsx - Detailed view of a specific weekend with events
ProfileView.jsx - User profile view with stats and settings

Reusable Weekend Components

WeekendCard.jsx - Card component for displaying weekend information
EventItem.jsx - Component for displaying an individual event
AddEventForm.jsx - Form for adding new events to a weekend

Key Benefits of This Structure

Maintainability: Each component has a single responsibility, making the code easier to understand and maintain
Reusability: Common components like WeekendCard can be reused across different views
Separation of Concerns: UI components are separated from state management
Performance: Smaller components lead to more efficient rendering
Testability: Isolated components are easier to test
Developer Experience: Working on smaller, focused files improves the development experience