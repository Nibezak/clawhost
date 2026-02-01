# OpenClaw.Anywhere

A self-hostable cloud hosting management platform built as a TypeScript monorepo.

## Project Structure

```
openclaw.anywhere/
├── apps/
│   ├── api/              # Hono.js backend API (Node.js)
│   └── web/              # React + Vite frontend
├── packages/
│   ├── shared/           # @openclaw/shared - HTTP client utility
│   └── i18n/             # @openclaw/i18n - Internationalization
├── scripts/              # Utility scripts
└── turbo.json            # Turborepo build orchestration
```

## Tech Stack

### Backend (apps/api)

- **Framework**: Hono.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Admin SDK
- **External APIs**: Hetzner Cloud, Cloudflare DNS
- **Runtime**: Node.js 20+ with tsx

### Frontend (apps/web)

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State**: Zustand (with persist middleware)
- **Data Fetching**: TanStack React Query
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Icons**: Phosphor Icons
- **Animation**: Framer Motion
- **Auth**: Firebase

### Shared Packages

- **@openclaw/shared**: HTTP RequestClient utility
- **@openclaw/i18n**: Internationalization framework

## Code Conventions

### Import Rules

**CRITICAL: Always use `@/` path aliases in the web app. Never use relative imports like `../` or `./`.**

```typescript
// CORRECT - Use @ path aliases
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/routes'

// INCORRECT - Never use relative imports
import { Button } from '../components/ui/button' // DO NOT USE
import { api } from './lib/api' // DO NOT USE
```

**For workspace packages, use the package name:**

```typescript
import { RequestClient } from '@openclaw/shared'
import { t } from '@openclaw/i18n'
```

**Note:** The API app uses relative imports since it doesn't have path aliases configured.

### Types and Interfaces Rules

**CRITICAL: All types and interfaces must be centralized in `@/ts/`. Never define types or interfaces inline within component or utility files.**

**Type Imports Must Be at the Top of Files:**

```typescript
// CORRECT - Type imports at the very top using `import type`
import type { Claw, Plan, SSHKey, StatusConfig } from '@/ts/Interfaces'
import type { ViewMode, ToastType } from '@/ts/Types'
import { useState } from 'react'
import { api } from '@/lib/api'

// INCORRECT - Regular imports for types
import { Claw, Plan } from '@/ts/Interfaces' // DO NOT USE

// INCORRECT - Inline type definitions
interface MyComponentProps { // DO NOT USE - put in @/ts/Interfaces.ts
  title: string
}
```

**File Organization:**

- `@/ts/Types.ts` - All type aliases (e.g., `type ViewMode = 'list' | 'grid'`)
- `@/ts/Interfaces.ts` - All interfaces (e.g., `interface Claw { ... }`)
- `@/ts/index.ts` - Barrel export for convenient imports

**Categories in Interfaces.ts:**

- API / Data Models: `Claw`, `Plan`, `Location`, `SSHKey`, `Volume`, etc.
- Store Interfaces: `UIState`, `PreferencesState`, `ToastData`
- Auth Interfaces: `AuthContextType`
- Component Props: `HeaderProps`, `EmptyStateProps`, `ClawCardProps`, etc.
- Hook Data Types: `CreateClawData`, `CreateSSHKeyData`, etc.

### React Component Function Pattern

**CRITICAL: All React functional components must use the `const ComponentName: FC = (): ReactNode => { ... }` pattern with a separate export at the end.**

**For components without props:**

```typescript
import type { FC, ReactNode } from 'react'

const MyComponent: FC = (): ReactNode => {
  return <div>Content</div>
}

export default MyComponent
// or for named exports: export { MyComponent }
```

**For components with props:**

```typescript
import type { FC, ReactNode } from 'react'
import type { MyComponentProps } from '@/ts/Interfaces'

const MyComponent: FC<MyComponentProps> = ({ title, description }): ReactNode => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export default MyComponent
```

**INCORRECT patterns - Never use:**

```typescript
// DO NOT USE - function declaration with inline export
export default function MyComponent() { ... }

// DO NOT USE - function declaration without FC type
function MyComponent() { ... }

// DO NOT USE - arrow function without FC type
const MyComponent = () => { ... }
```

**Key rules:**

1. Always import `FC` and `ReactNode` from 'react' using `import type`
2. Use `FC` for components without props, `FC<PropsType>` for components with props
3. Always include `: ReactNode` as the return type annotation
4. Use `export default ComponentName` at the end of the file for default exports
5. Use `export { ComponentName }` for named exports
6. Internal/helper components within a file should also follow this pattern

### File Organization

**API Controllers** (`apps/api/src/controllers/`):

- Group by resource (claws, users, ssh-keys, plans)
- Each controller exports individual functions
- Use barrel exports in index.ts

**API Routes** (`apps/api/src/routes/`):

- One file per resource
- Import controllers and wire to Hono routes
- Combine in routes/index.ts

**Web Pages** (`apps/web/src/pages/`):

- One component per page
- Use PageTitle for document title management
- Include PageBackground for consistent styling

**Web Components** (`apps/web/src/components/`):

- `ui/` for shadcn/ui primitives
- Custom components at root level
- Keep components focused and composable

### Database

**Schema Location**: `apps/api/src/db/schema.ts`

**Tables**:

- `users` - Firebase authenticated users
- `claws` - Hetzner Cloud server instances
- `sshKeys` - SSH key management
- `volumes` - Persistent storage volumes

**Migrations**: Use Drizzle Kit

```bash
pnpm --filter api db:generate  # Generate migration
pnpm --filter api db:migrate   # Run migrations
```

### API Structure

**Authentication**: Bearer token middleware validates Firebase tokens

**Endpoints**:

- `GET/POST /api/claws` - Instance management
- `GET/POST/DELETE /api/ssh-keys` - SSH key CRUD
- `GET/PUT /api/users/me` - User profile
- `GET /api/plans` - Available plans/locations

### State Management (Web)

**Zustand Stores** (`apps/web/src/lib/store.ts`):

- `useUIStore` - Toast notifications, loading states
- `usePreferencesStore` - User preferences (persisted)

### Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for React components
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE for routes, camelCase otherwise
- **Database columns**: camelCase (Drizzle handles snake_case conversion)

## Development

### Commands

```bash
# Development
pnpm dev          # Run all apps
pnpm dev:web      # Run web only (port 1111)
pnpm dev:api      # Run API only (port 2222)

# Building
pnpm build        # Build all apps

# Database
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:studio
```

### Ports

- Web: 1111 (proxies /api to 2222)
- API: 2222

### Environment Variables

**API** (apps/api/.env):

```
DATABASE_URL=postgresql://...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
HETZNER_API_TOKEN=...
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ZONE_ID=...
```

**Web** (apps/web/.env):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

## Key Files

| Purpose      | Path                            |
| ------------ | ------------------------------- |
| API Entry    | `apps/api/src/index.ts`         |
| DB Schema    | `apps/api/src/db/schema.ts`     |
| API Routes   | `apps/api/src/routes/index.ts`  |
| Web Entry    | `apps/web/src/main.tsx`         |
| Web Routes   | `apps/web/src/App.tsx`          |
| Auth Context | `apps/web/src/lib/auth.tsx`     |
| API Client   | `apps/web/src/lib/api.ts`       |
| Stores       | `apps/web/src/lib/store.ts`     |
| Types        | `apps/web/src/ts/Types.ts`      |
| Interfaces   | `apps/web/src/ts/Interfaces.ts` |

### Internationalization (i18n)

**CRITICAL: Never use hardcoded text strings in the UI. All user-facing text must use the translation function.**

**How it works:**

1. All translations are defined in `packages/i18n/src/langs/en.ts`
2. Import and use the `t()` function from `@openclaw/i18n`
3. Use dot notation for nested keys (e.g., `t('dashboard.status.running')`)
4. For dynamic text with parameters, use `t('key', { param: value })`

```typescript
// CORRECT - Use translation function
import { t } from '@openclaw/i18n'

<Button>{t('common.save')}</Button>
<p>{t('dashboard.noClawsDescription')}</p>
<span>{t('common.copiedWithLabel', { label: 'Password' })}</span>

// INCORRECT - Never hardcode text
<Button>Save</Button>  // DO NOT USE
<p>Deploy OpenClaw on your first VPS</p>  // DO NOT USE
```

**Translation keys are organized by category:**

- `common.*` - Shared UI text (Save, Cancel, Delete, Loading, etc.)
- `nav.*` - Navigation items
- `footer.*` - Footer content
- `errors.*` - Error messages
- `auth.*` - Authentication pages
- `account.*` - Account page
- `dashboard.*` - Dashboard/Claws page
- `createClaw.*` - Create Claw modal
- `sshKeys.*` - SSH Keys page
- `landing.*` - Landing page

**When adding new features:**

1. First add all text strings to `packages/i18n/src/langs/en.ts`
2. Use descriptive, hierarchical key names
3. Then reference them in components using `t('category.keyName')`

## Guidelines for AI

1. **Always read files before modifying** - Understand existing patterns first
2. **Use `@/` imports in web app** - Always use path aliases, never relative imports
3. **Centralize types in `@/ts/`** - Never define types/interfaces inline; add to Types.ts or Interfaces.ts
4. **Use `import type` for types** - Always use `import type` syntax and place at top of file
5. **Use FC pattern for components** - Always use `const ComponentName: FC = (): ReactNode => { ... }` with `export default ComponentName` at the end
6. **Follow existing patterns** - Match the style of surrounding code
7. **Keep it simple** - Avoid over-engineering or adding unnecessary abstractions
8. **Controllers handle logic** - Routes should be thin wrappers
9. **Use RequestClient** - For API calls, use the shared HTTP client
10. **Zustand for state** - Don't introduce additional state management
11. **shadcn/ui components** - Prefer existing UI components over custom ones
12. **Use translations for all text** - Never hardcode user-facing text; always use `t()` from `@openclaw/i18n`
