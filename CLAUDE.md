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

**CRITICAL: Always use `@/` path aliases in both the web app and the API app. Never use `../` relative imports under any circumstance. This applies to ALL `.ts` and `.tsx` files — including files in `scripts/`, entry points, and any other directory outside `src/`.**

```typescript
// CORRECT - Use @ path aliases
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { db } from '@/db'
import { hetzner } from '@/services/hetzner'

// CORRECT - Script files also use @/ aliases
// apps/api/scripts/example.ts
import { hetzner } from '@/services/hetzner'

// INCORRECT - Never use ../ relative imports
import { Button } from '../components/ui/button' // DO NOT USE
import { db } from '../../db' // DO NOT USE
import { hetzner } from '../src/services/hetzner' // DO NOT USE (even in scripts/)
```

**`./` imports are NEVER allowed.** All imports must use `@/` path aliases — including barrel exports, same-directory siblings, and subdirectory imports.

**For workspace packages, use the package name:**

```typescript
import { RequestClient } from '@openclaw/shared'
import { t } from '@openclaw/i18n'
```

### One Export Per File Rule

**CRITICAL: Every `.ts` and `.tsx` file must export exactly ONE function, component, constant, or class via `export default`. No file should have multiple exports.**

**When a module needs multiple exports, convert it to a folder:**

```
lib/example.ts (BEFORE - multiple exports)
↓
lib/example/           (AFTER - one per file)
  doThing.ts           → export default doThing
  doOtherThing.ts      → export default doOtherThing
  index.ts             → barrel re-exports
```

**Barrel `index.ts` syntax:**

```typescript
import doThing from '@/lib/example/doThing'
import doOtherThing from '@/lib/example/doOtherThing'

export {
    doThing,
    doOtherThing
}
```

**NEVER use `export { default as X } from` syntax in barrel files.** Always import the default first, then re-export by name.

**Private/internal modules** (shared state, config) within a folder don't need to be in the barrel.

**Exempt from this rule:**

- `ts/Types.ts` and `ts/Interfaces.ts` — type centralization files
- `ts/index.ts` — type barrel
- Barrel `index.ts` files — they are the aggregation mechanism
- shadcn/ui components in `components/ui/` — third-party generated

**Reference pattern:** See `apps/api/src/controllers/claws/` for the canonical example.

### Types and Interfaces Rules

**CRITICAL: All types and interfaces must be centralized in `@/ts/`. This applies to BOTH `apps/web` AND `apps/api`. Never define types, interfaces, or inline object types anywhere else — not in components, hooks, services, controllers, lib files, or scripts.**

**This includes:**

- `interface` definitions
- `type` alias definitions
- Inline object types in function parameters (e.g., `(data: { name: string })`)
- Inline object types in return types (e.g., `Promise<{ id: string }>`)
- Inline union types used as standalone types
- Props types for React components

**Centralized Type Files:**

| App | Interfaces                      | Types                      | Barrel                     |
| --- | ------------------------------- | -------------------------- | -------------------------- |
| Web | `apps/web/src/ts/Interfaces.ts` | `apps/web/src/ts/Types.ts` | `apps/web/src/ts/index.ts` |
| API | `apps/api/src/ts/Interfaces.ts` | `apps/api/src/ts/Types.ts` | `apps/api/src/ts/index.ts` |

**Type Imports Must Be at the Top of Files, Separated by an Empty Line:**

```typescript
// CORRECT - Type imports first, then empty line, then regular imports
import type { Claw, Plan, SSHKey, StatusConfig } from '@/ts/Interfaces'
import type { ViewMode, ToastType } from '@/ts/Types'

import { useState } from 'react'
import { api } from '@/lib/api'

// INCORRECT - Missing empty line between type and regular imports
import type { Claw } from '@/ts/Interfaces' // DO NOT USE
import { useState } from 'react' // (no blank line above)

// INCORRECT - Type imports after regular imports
import { useState } from 'react' // DO NOT USE
import type { Claw } from '@/ts/Interfaces' // (type import must be above)

// INCORRECT - Regular imports for types
import { Claw, Plan } from '@/ts/Interfaces' // DO NOT USE

// INCORRECT - Inline type definitions
interface MyComponentProps {
    // DO NOT USE - put in @/ts/Interfaces.ts
    title: string
}

// INCORRECT - Inline object types in functions
async function getUser(): Promise<{ id: string; name: string }> {} // DO NOT USE
function create(data: { email: string; name?: string }): void {} // DO NOT USE

// CORRECT - Use named interfaces from @/ts/Interfaces
async function getUser(): Promise<UserProfile> {} // USE THIS
function create(data: CreateUserParams): void {} // USE THIS
```

**File Organization:**

- `@/ts/Types.ts` - All type aliases (e.g., `type ViewMode = 'list' | 'grid'`)
- `@/ts/Interfaces.ts` - All interfaces (e.g., `interface Claw { ... }`)
- `@/ts/index.ts` - Barrel export for convenient imports

**Categories in web Interfaces.ts:**

- API / Data Models: `Claw`, `Plan`, `Location`, `SSHKey`, `Volume`, etc.
- Store Interfaces: `UIState`, `PreferencesState`, `ToastData`
- Auth Interfaces: `AuthContextType`
- Component Props: `HeaderProps`, `EmptyStateProps`, `ClawCardProps`, etc.
- Hook Data Types: `CreateClawData`, `CreateSSHKeyData`, etc.

**Categories in api Interfaces.ts:**

- Hetzner Types: `HetznerServer`, `HetznerVolume`, `ServerStatus`, `LocationInfo`, etc.
- Polar Types: `CheckoutSession`, `PolarSubscription`, `PolarOrder`, `PolarCustomer`, etc.
- Webhook Types: `WebhookEvent`, `WebhookHandlers`, `CheckoutWebhookData`, etc.
- Controller Types: `ProvisionClawParams`, `ClawCleanupData`, etc.
- Email Props: `MagicLinkEmailProps`

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

## Formatting & Linting Rules

**CRITICAL: All code written or modified must strictly follow these formatting and linting rules. These are enforced by ESLint and Prettier and checked by Husky pre-commit hooks. Never deviate from them.**

### Prettier Rules (enforced by `.prettierrc`)

- **Single quotes** — Always use single quotes (`'`), never double quotes (`"`)
- **No semicolons** — Never end statements with semicolons
- **4-space indentation** — Use 4 spaces for all indentation, never tabs, never 2 spaces
- **No trailing commas** — Never add trailing commas in arrays, objects, function params, or imports
- **Single JSX quotes** — Use single quotes in JSX attributes (`<div className='foo'>`)
- **Tailwind class sorting** — Classes are auto-sorted by `prettier-plugin-tailwindcss`

### ESLint Rules (enforced by `eslint.config.js`)

These apply to **both api and web** — every `.js`, `.mjs`, `.cjs`, `.ts`, and `.tsx` file:

- **4-space indentation** — `indent: ['error', 4]`
- **Single quotes** — `quotes: ['error', 'single']`
- **No semicolons** — `semi: ['error', 'never']`
- **No trailing commas** — `comma-dangle: ['error', 'never']`
- **Single JSX quotes** — `jsx-quotes: ['error', 'prefer-single']`
- **No multiple empty lines** — Max 1 empty line between code, 0 at start of file, 0 at end of file
- **No newline at end of file** — `eol-last: ['error', 'never']`
- **No `@ts-ignore` restrictions** — `@typescript-eslint/ban-ts-comment` is off
- **Linebreak style** — Disabled (cross-platform)

TypeScript-specific rules (`.ts` and `.tsx` files):

- **Warn on unused variables** — Except those prefixed with `_`
- **Warn on `any` type** — Prefer explicit types over `any`
- **Enforce `import type`** — Always use `import type` for type-only imports with separate-type-imports style

React-specific rules (web app only):

- **React Hooks rules** — Enforced (deps arrays, rules of hooks)
- **React Refresh** — Warns on non-component exports in component files

### Pre-commit Hook (Husky)

On every commit, Husky runs:

1. `pnpm check` — Runs `tsc --noEmit` and `eslint .` for both api and web
2. `pnpm version:patch` — Auto-bumps patch version in both `apps/api/package.json` and `apps/web/package.json`
3. Stages the bumped `package.json` files

### How to Follow These Rules

When writing any code:

```typescript
// CORRECT
const myFunction = (param: string): string => {
    const result = doSomething(param)
    return result
}

const myObject = {
    key: 'value',
    nested: {
        foo: 'bar'
    }
}

import type { MyType } from '@/ts/Interfaces'
import { useState } from 'react'

// INCORRECT — violates multiple rules
const myFunction = (param: string): string => {
    const result = doSomething(param) // 2-space indent + semicolons
    return result
}

const myObject = {
    key: 'value', // double quotes + 2-space indent
    nested: {
        foo: 'bar' // trailing comma + double quotes
    }
}
```

### Verification Commands

```bash
pnpm format:check    # Check if all files match Prettier rules
pnpm format          # Auto-fix Prettier formatting
pnpm lint            # Check ESLint rules
pnpm lint:fix        # Auto-fix ESLint issues
pnpm check           # Run tsc + eslint for both api and web
```

## Guidelines for AI

1. **Always read files before modifying** - Understand existing patterns first
2. **Use `@/` imports everywhere** - Always use path aliases in both web and API apps, never use `../` or `./` relative imports anywhere
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
13. **Never write comments** - Do not add code comments, JSX comments, section markers, or doc comments. The code should be self-explanatory. The only exception is when logic is truly non-obvious (e.g., bitwise operations, crypto algorithms, or workarounds for framework bugs)
14. **Never add console.log** - Do not add `console.log` statements. Use `console.error` only for actual error handling in catch blocks. No debug logging, no request logging, no data logging
15. **No section markers** - Never write comments like `// Section Name`, `{/* Section */}`, `// ========`, or category headers in files
16. **Strict formatting compliance** - Every line of code must follow the Prettier and ESLint rules defined above. 4-space indentation, single quotes, no semicolons, no trailing commas, no end-of-file newlines. No exceptions
17. **Run checks after changes** - After writing or modifying code, verify with `pnpm lint` and `pnpm format:check` to ensure compliance
