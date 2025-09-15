# Clause Definition Manager

A modern React application for managing clause definitions with advanced table features and persistent state management.

## Features

- **Clause Management**: Create, edit, and delete clause definitions
- **Advanced Table**: Sortable, filterable, and paginated data table
- **Persistent State**: Table preferences (sorting, page size) are saved across sessions
- **Real-time Search**: Debounced search with instant filtering
- **Status Filtering**: Filter clauses by status (Draft, Published, Archived)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support with strict typing

## Getting Started

To run this application:

```bash
yarn install
yarn dev
```

The application will be available at `http://localhost:3000`

## Building For Production

To build this application for production:

```bash
yarn build
yarn preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
yarn run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
yarn run lint
yarn run format
yarn run check
```


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpx shadcn@latest add button
```



## Architecture

### Technology Stack

- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety throughout the application
- **TanStack Router**: File-based routing for SPA navigation
- **Redux Toolkit**: Predictable state management
- **Redux Persist**: Selective state persistence
- **TanStack Table**: Advanced table functionality
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: High-quality component library
- **Vite**: Fast build tool and development server

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── ClauseForm.tsx  # Clause creation/editing form
│   ├── ClauseTable.tsx # Advanced data table
│   └── Layout.tsx      # Application layout
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   │   ├── clausesSlice.ts  # Clause data management
│   │   └── tableSlice.ts    # Table state management
│   └── index.ts        # Store configuration
├── routes/             # TanStack Router routes
│   ├── __root.tsx      # Root layout
│   └── index.tsx       # Home page
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

**Current Routes:**
- `/` - Main application with clause management table

**Adding New Routes:**
Create new files in `src/routes/` directory. TanStack Router will automatically generate route definitions.

**Navigation:**
```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
```


## Key Features

### Advanced Table Functionality

The application features a sophisticated data table with:

- **Multi-column Sorting**: Click column headers to sort by any field
- **Real-time Search**: Debounced search across title, description, and chain ID
- **Status Filtering**: Filter by clause status (Draft, Published, Archived)
- **Pagination**: Configurable page sizes (10, 25, 50, 100 rows)
- **Persistent Preferences**: Sorting and page size preferences are saved
- **Responsive Design**: Mobile-friendly table layout

### State Persistence

The application uses Redux Persist with a selective persistence strategy:

- **Persisted**: Table sorting preferences and page size
- **Reset on Load**: Search terms, filters, and current page

This provides a clean user experience while maintaining user preferences.

### Form Management

Clause creation and editing uses React Hook Form with Zod validation:

- **Type-safe Forms**: Full TypeScript integration
- **Real-time Validation**: Instant feedback on form errors
- **Optimistic Updates**: Immediate UI updates with error handling


## State Management

This application uses **Redux Toolkit** for state management with **Redux Persist** for selective persistence.

### Store Structure

- **Clauses Slice**: Manages clause data (items, loading states, errors)
- **Table Slice**: Manages table state with selective persistence

### Persistence Strategy

The application uses a selective persistence approach:

**Persisted State:**
- Table sorting preferences
- Page size settings

**Non-Persisted State:**
- Current page (always resets to page 1)
- Search terms (always starts empty)
- Filter states (always starts with no filters)

This ensures users get a clean start while preserving their preferred table configuration.

### Redux Store Configuration

```typescript
// Store with selective persistence
export const store = configureStore({
  reducer: {
    clauses: clausesReducer,
    table: persistedTableReducer, // Only sorting and pageSize persisted
  },
});
```

### Table State Management

The table slice provides actions for:
- `setSorting`: Update column sorting
- `setPageSize`: Change rows per page
- `setPageIndex`: Navigate pages
- `setSearchTerm`: Update search filter
- `setSelectedStates`: Update status filters
- `clearFilters`: Reset all filters
- `resetNonPersistedState`: Reset non-persisted state on app load

## Development

### Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build

# Code Quality
yarn lint         # Run linter
yarn format       # Format code
yarn check        # Run all checks

# Testing
yarn test         # Run tests
```

### Adding Components

This project uses Shadcn UI for components. Add new components with:

```bash
npx shadcn@latest add [component-name]
```

### Type Safety

The project enforces strict TypeScript configuration:
- No `any` types allowed
- Strict null checks enabled
- Precise type annotations required

## Learn More

- [TanStack Router](https://tanstack.com/router) - File-based routing
- [TanStack Table](https://tanstack.com/table) - Headless table library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
