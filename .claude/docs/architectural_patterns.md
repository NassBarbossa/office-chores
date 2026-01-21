# Architectural Patterns

Patterns and conventions used throughout the office-chores codebase.

## State Management Pattern

### Single Store Architecture

All application state lives in one Zustand store (`src/store/useAppStore.ts:44-182`).

**Characteristics:**
- Created with `create()` and wrapped in `persist()` middleware
- Actions defined alongside state in the store creator function
- Immutable updates using spread operators (e.g., line 64, 70-74)
- Direct getter access via `get()` for reading current state in actions

### Selector Pattern

Selectors in `src/store/selectors.ts` provide:
- Granular subscriptions to prevent unnecessary re-renders
- Decoupled component logic from store structure
- Reusable state access patterns

```typescript
// Simple selectors (line 5-8)
export const useTeamMembers = () => useAppStore((state) => state.teamMembers);

// Parameterized selectors (line 10-12)
export const useTeamMemberById = (id: string | null) =>
  useAppStore((state) => (id ? state.teamMembers.find((m) => m.id === id) : undefined));
```

## Component Architecture

### Component Categories

1. **Layout Components** (`src/components/layout/`): App structure, no business logic
2. **Feature Components** (`src/components/calendar/`, `chores/`, `team/`): Domain-specific logic
3. **UI Components** (`src/components/ui/`): Reusable primitives, no business logic
4. **Modal Components** (`src/components/modals/`): Self-contained dialog flows

### Controlled Form Pattern

All forms use controlled components with local state:

```typescript
// src/components/modals/AddChoreModal.tsx pattern
const [title, setTitle] = useState('');
const [frequency, setFrequency] = useState<Frequency>('weekly');

<Input value={title} onChange={(e) => setTitle(e.target.value)} />
```

State reset on modal close/submit for clean re-opens.

## Hook Patterns

### Custom Hooks

1. **Data transformation hooks** with memoization (`src/hooks/useCalendarEvents.ts:6-21`):
   ```typescript
   export const useCalendarEvents = () => {
     const instances = useChoreInstances();
     return useMemo(() => instances.map(transform), [instances]);
   };
   ```

2. **Side effect hooks** (`src/hooks/useEnsureInstances.ts`):
   - Run on mount to ensure data exists
   - Use store actions for state updates

### React Hook Usage

- `useState`: Local component state only (forms, UI toggles)
- `useMemo`: Expensive computations, derived data
- `useCallback`: Event handlers passed to children
- `useEffect`: Side effects (keyboard listeners, mount effects)

## Modal Pattern

Standardized modal implementation (`src/components/ui/Modal.tsx:10-51`):

**Features:**
- `isOpen` boolean control
- Escape key dismissal (line 12-14)
- Click-outside-to-close (line 33)
- Body scroll lock when open (line 18, 23)
- Accessible with semantic HTML

**Usage:**
```tsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Chore">
  {/* form content */}
</Modal>
```

## Date Handling Pattern

### String Storage, Object Display

Dates stored as `'YYYY-MM-DD'` strings (`src/types/index.ts:22`) to:
- Simplify JSON serialization for localStorage
- Avoid timezone issues with Date objects
- Enable easy string comparison/sorting

Conversion utilities in `src/utils/date.ts`:
- `formatDate(date: Date): string` - Date to string
- `parseDate(dateString: string): Date` - String to Date

### Lazy Instance Generation

Chore instances generated on-demand (`src/store/useAppStore.ts:134-176`):
- Initial: 3 months from current date
- Extended when user navigates beyond `generatedUntil`
- Prevents memory bloat from infinite future instances

## Recurrence Pattern

Uses rrule library for iCalendar RFC 5545 compliance (`src/utils/recurrence.ts`).

**Frequency mapping (line 5-10):**
```typescript
const frequencyMap = {
  none: null,
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
};
```

**Generation logic (line 12-36):**
- Creates RRule with frequency, interval, start, and optional end date
- Returns array of `'YYYY-MM-DD'` strings

## Color Assignment Pattern

Team member colors auto-assigned from predefined palette (`src/store/useAppStore.ts:9-18`):

```typescript
const MEMBER_COLORS = ['#3B82F6', '#10B981', ...]; // 8 colors

// Assignment logic (line 54-56)
const usedColors = new Set(teamMembers.map(m => m.color));
const availableColor = MEMBER_COLORS.find(c => !usedColors.has(c))
  || MEMBER_COLORS[teamMembers.length % MEMBER_COLORS.length];
```

Colors cycle when more than 8 members exist.

## Event Propagation Pattern

Calendar events carry full instance data via `resource` property:

```typescript
// src/hooks/useCalendarEvents.ts:17
resource: instance  // Full ChoreInstance attached
```

Enables modal access to instance data without additional store lookups:
```typescript
// In CalendarContainer
onSelectEvent={(event) => setSelectedInstance(event.resource)}
```

## Cascade Delete Pattern

When removing entities, related data is cleaned up (`src/store/useAppStore.ts`):

- Remove team member → unassign from all instances (line 71-73)
- Remove chore template → delete all related instances (line 106)

## TypeScript Conventions

- Explicit union types for constrained values (`'pending' | 'completed'`)
- `type` imports for type-only imports
- Interfaces for object shapes, types for unions
- Strict mode enabled (`noUnusedLocals`, `noUnusedParameters`)
