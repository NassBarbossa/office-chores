# Office Chores

A team chore management and scheduling web application with calendar visualization.

## Project Purpose

Coordinate recurring office/shared living tasks among team members with:
- Team member management with unique color assignments
- Chore templates with recurrence rules (daily/weekly/monthly)
- Calendar visualization (month/week views)
- Assignment and completion tracking
- Browser localStorage persistence

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (with persist middleware) |
| Calendar | react-big-calendar |
| Dates | date-fns, rrule (RFC 5545) |
| Linting | ESLint 9 + typescript-eslint |

## Project Structure

```
src/
├── components/
│   ├── calendar/      # Calendar display (CalendarContainer, ChoreEvent, ViewToggle)
│   ├── chores/        # Chore management (AddChoreButton, ChoreTemplateList)
│   ├── layout/        # App structure (MainLayout, Header, Sidebar)
│   ├── modals/        # Dialogs (AddChoreModal, AssignChoreModal)
│   ├── team/          # Team members (AddTeamMemberForm, TeamMemberList)
│   └── ui/            # Reusable primitives (Button, Input, Modal, Select)
├── hooks/             # Custom hooks
├── store/             # Zustand state management
├── styles/            # CSS (calendar overrides)
├── types/             # TypeScript definitions
└── utils/             # Date and recurrence utilities
```

## Entry Points

- `src/main.tsx` - Application bootstrap, renders `<App />` to `#root`
- `src/App.tsx:5-13` - Root component, wraps `CalendarContainer` in `MainLayout`
- `src/hooks/useEnsureInstances.ts` - Called in App to generate initial chore instances on mount

## Essential Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

**No test framework configured** - tests can be added with Vitest (recommended for Vite projects).

## Core Types

Defined in `src/types/index.ts`:

- **TeamMember** (line 1-5): id, name, color
- **ChoreTemplate** (line 7-16): id, title, description, recurrence rules
- **ChoreInstance** (line 18-25): id, templateId, date, assigneeId, status
- **CalendarEvent** (line 29-35): calendar display format with resource reference

## Key Files

| File | Purpose |
|------|---------|
| `src/store/useAppStore.ts` | Central Zustand store with all state and actions |
| `src/store/selectors.ts` | Selector hooks for optimized re-renders |
| `src/utils/recurrence.ts` | rrule-based occurrence generation |
| `src/utils/date.ts` | Date formatting/parsing utilities |
| `src/hooks/useCalendarEvents.ts` | Transforms instances to calendar events |
| `src/hooks/useEnsureInstances.ts` | Ensures instances exist for 3-month window on mount |
| `src/components/ui/Modal.tsx` | Reusable modal with escape key handling |
| `src/styles/calendar.css` | Custom styles for react-big-calendar overrides |

## State Management

Single Zustand store (`src/store/useAppStore.ts:44`) with:
- **State**: teamMembers, choreTemplates, choreInstances, calendarView, generatedUntil
- **Persistence**: localStorage key `'office-chores-storage'` (line 179)
- **Lazy Generation**: Instances generated 3 months ahead, extended on navigation (line 134)

Access state via selectors in `src/store/selectors.ts`:
```typescript
useTeamMembers(), useChoreTemplates(), useChoreInstances(), useCalendarView()
useTeamMemberById(id), useChoreInstanceById(id), useCalendarEvents()
```

## Recurrence System

Uses rrule library (`src/utils/recurrence.ts`):
- `generateOccurrences()` (line 12): Creates date strings from template rules
- `shouldGenerateMoreInstances()` (line 38): Determines if more instances needed
- Frequencies: none, daily, weekly, monthly with configurable intervals

## Data Flow

1. User action triggers store action method
2. Store updates state immutably
3. Selectors provide derived data to components
4. Components re-render via Zustand subscriptions

Dates stored as `'YYYY-MM-DD'` strings internally, converted to Date objects for calendar display.

## Adding New Features or fixing bugs

**IMPORTANT**: When you work on a new feature or bug, create a git branch first. Then work on changes in that branch for the remainder of the session.

### New Component
1. Create in appropriate `src/components/` subdirectory based on domain
2. Use existing UI primitives from `src/components/ui/`
3. Access state via selectors from `src/store/selectors.ts`
4. Follow controlled component pattern for forms

### New Store State/Action
1. Add type to `src/types/index.ts`
2. Add state field and action to `src/store/useAppStore.ts:20-42` (interface) and implementation below
3. Create selector in `src/store/selectors.ts`
4. Use immutable updates with spread operators

### New Recurrence Frequency
1. Add to frequency union in `src/types/index.ts:12`
2. Map to rrule constant in `src/utils/recurrence.ts:5-10`
3. Add UI option in `src/components/modals/AddChoreModal.tsx`

### New Modal
1. Create in `src/components/modals/`
2. Use `Modal` component from `src/components/ui/Modal.tsx`
3. Manage open state in parent component
4. Reset form state on close

## Development Notes

- **Reset app state**: Clear localStorage key `office-chores-storage` in DevTools
- **Browser support**: ES2022 target - modern browsers only (`tsconfig.app.json:4`)
- **TypeScript**: Strict mode with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
- **No backend**: App runs entirely client-side with localStorage persistence

## Additional Documentation

When working on specific areas, consult:

| Topic | File |
|-------|------|
| Architectural patterns & conventions | `.claude/docs/architectural_patterns.md` |
