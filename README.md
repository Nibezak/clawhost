<p align="center">
  <img src="https://cdn.clawhost.cloud/assets/clawhost-logo-light.png" alt="ClawHost" height="42" />
</p>

<p align="center">
  Deploy OpenClaw on your own VPS with one click.<br/>
  Full privacy, dedicated resources, no shared infrastructure.
</p>

<p align="center">
  <a href="https://clawhost.cloud">Website</a> &middot;
  <a href="https://clawhost.cloud/posts">Blog</a> &middot;
  <a href="#self-hosting">Self-Host Guide</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-green" alt="Node 20+" />
  <img src="https://img.shields.io/badge/pnpm-9.14%2B-orange" alt="pnpm 9.14+" />
  <img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript" />
</p>

---

## What is ClawHost?

ClawHost is an open-source, self-hostable cloud hosting platform that lets anyone deploy [OpenClaw](https://openclaw.dev) on a dedicated VPS in under a minute. It handles server provisioning, DNS, SSL, firewall configuration, and OpenClaw installation automatically — so you can focus on using AI, not managing infrastructure.

### Key Highlights

- **One-Click Deploy** — Select a provider, pick a plan, pay, and OpenClaw is live within minutes
- **Multi-Cloud** — Choose between Hetzner, DigitalOcean, and Vultr as your cloud provider
- **Dedicated VPS** — Real servers with full root access, not shared containers
- **Agent Playground** — Visual canvas for managing AI agents with drag-and-drop workflows
- **Chat Interface** — Real-time WebSocket chat with your OpenClaw agents
- **Channel Integrations** — Connect Telegram, Discord, Slack, Signal, and WhatsApp
- **Skills & ClawHub** — Browse, install, and manage skills from the ClawHub marketplace
- **Diagnostics & Logs** — Monitor server health, view logs, and repair instances
- **File & Env Management** — Edit configuration files and environment variables remotely
- **Automatic SSL** — HTTPS via Let's Encrypt, configured automatically
- **DNS Management** — Automatic subdomain creation via Cloudflare
- **SSH Key Management** — Store and assign keys for passwordless access across all providers
- **Persistent Storage** — Attach additional volumes to any instance
- **Multi-Auth** — Sign in with OTP email, Google, or GitHub
- **Billing Built-In** — Polar.sh integration for subscriptions, invoicing, and billing portal
- **Export & Backup** — Export claw configurations for backup and migration
- **Cross-Platform** — Web, mobile (iOS/Android), and desktop (macOS/Linux) apps
- **Fully Open Source** — MIT licensed, self-host the entire platform yourself

## Architecture

ClawHost is a TypeScript monorepo built with [Turborepo](https://turbo.build) and managed with [pnpm](https://pnpm.io).

```
clawhost/
├── apps/
│   ├── api/                 # Hono.js backend API
│   ├── web/                 # React + Vite frontend
│   ├── mobile/              # React Native + Expo mobile app
│   └── clawhostgo/          # Electron desktop app
├── packages/
│   ├── shared/              # @openclaw/shared — HTTP client utility
│   └── i18n/                # @openclaw/i18n — Internationalization
├── scripts/
│   ├── cloud-init.yaml      # Server initialization template
│   └── configure-polar-portal.ts  # Polar portal configuration
├── turbo.json               # Turborepo build orchestration
└── pnpm-workspace.yaml      # Workspace definition
```

### Tech Stack

| Layer                   | Technology                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| **API Framework**       | [Hono](https://hono.dev) on Node.js                                                                             |
| **Database**            | PostgreSQL ([Neon](https://neon.tech)) with [Drizzle ORM](https://orm.drizzle.team)                              |
| **Authentication**      | [Firebase](https://firebase.google.com) (OTP email, Google, GitHub)                                             |
| **Server Provisioning** | [Hetzner Cloud](https://docs.hetzner.cloud), [DigitalOcean](https://docs.digitalocean.com), [Vultr](https://www.vultr.com/api/) |
| **Remote Management**   | SSH2 for remote command execution, file management, and diagnostics                                              |
| **DNS**                 | [Cloudflare API](https://developers.cloudflare.com/api)                                                         |
| **Billing**             | [Polar.sh](https://polar.sh)                                                                                    |
| **Email**               | [Resend](https://resend.com) with React Email                                                                   |
| **Frontend**            | [React 18](https://react.dev) + [Vite](https://vitejs.dev)                                                      |
| **UI Components**       | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) + [Tailwind CSS](https://tailwindcss.com) |
| **Visual Canvas**       | [React Flow](https://reactflow.dev) with [Dagre](https://github.com/dagrejs/dagre) layout                       |
| **Code Editor**         | [CodeMirror](https://codemirror.net) via @uiw/react-codemirror                                                   |
| **State Management**    | [Zustand](https://zustand-demo.pmnd.rs)                                                                         |
| **Data Fetching**       | [TanStack React Query](https://tanstack.com/query)                                                              |
| **Icons**               | [Phosphor Icons](https://phosphoricons.com)                                                                     |
| **Animations**          | [Framer Motion](https://www.framer.com/motion)                                                                  |
| **Blog**                | MDX with frontmatter                                                                                            |
| **Mobile**              | [React Native](https://reactnative.dev) + [Expo](https://expo.dev)                                              |
| **Desktop**             | [Electron](https://www.electronjs.org) with Electron Forge                                                       |
| **Monorepo**            | [Turborepo](https://turbo.build) + [pnpm](https://pnpm.io)                                                      |

### Database Schema

| Table          | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `users`        | Firebase-authenticated users with Polar customer IDs and auth methods    |
| `claws`        | Cloud server instances across all providers (status, IP, subdomain, etc) |
| `pendingClaws` | Temporary storage for in-progress checkout sessions                      |
| `sshKeys`      | SSH public keys with per-provider key IDs                                |
| `volumes`      | Persistent storage volumes attached to claws                             |
| `otpCodes`     | OTP authentication codes with expiration and attempt tracking            |
| `rateLimits`   | Rate limiting for authentication endpoints                               |
| `clawExports`  | Export/backup records with file metadata                                 |

## Self-Hosting

### Prerequisites

- **Node.js** 20+
- **pnpm** 9.14+
- **PostgreSQL** database (Neon, Supabase, or self-hosted)

### External Services

| Service                                                | Purpose                 | What You Need                         |
| ------------------------------------------------------ | ----------------------- | ------------------------------------- |
| [Hetzner Cloud](https://console.hetzner.cloud)         | Server provisioning     | API Token (Read & Write)              |
| [DigitalOcean](https://cloud.digitalocean.com)         | Server provisioning     | API Token                             |
| [Vultr](https://my.vultr.com)                          | Server provisioning     | API Key                               |
| [Firebase](https://console.firebase.google.com)        | Authentication          | Project credentials + Service account |
| [Cloudflare](https://dash.cloudflare.com)              | DNS management          | API Token + Zone ID                   |
| [Polar.sh](https://polar.sh)                           | Billing & subscriptions | API credentials + Webhook secret      |
| [Resend](https://resend.com)                           | Transactional email     | API Key                               |

At least one cloud provider is required. You can configure one, two, or all three.

### 1. Clone & Install

```bash
git clone https://github.com/bfzli/clawhost.git
cd clawhost
pnpm install
```

### 2. Configure Environment Variables

**API** — create `apps/api/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloud Providers (at least one required)
HETZNER_API_TOKEN=your-hetzner-api-token
DIGITALOCEAN_API_TOKEN=your-digitalocean-api-token
VULTR_API_TOKEN=your-vultr-api-token

# Cloudflare DNS
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Polar (payments)
POLAR_ACCESS_TOKEN=your-polar-access-token
POLAR_ORGANIZATION_ID=your-polar-org-id
POLAR_WEBHOOK_SECRET=your-polar-webhook-secret

# Resend (email)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=OpenClaw <noreply@yourdomain.com>

# Server
PORT=2222
CLIENT=localhost:1111
```

**Web** — create `apps/web/.env`:

```bash
# API
VITE_API_URL=/api

# Firebase Client SDK
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Set Up External Services

<details>
<summary><strong>Hetzner Cloud</strong></summary>

1. Go to [Hetzner Cloud Console](https://console.hetzner.cloud)
2. Create a new project or select an existing one
3. Navigate to **Security** > **API Tokens**
4. Generate a token with **Read & Write** permissions
5. Copy to `HETZNER_API_TOKEN`

</details>

<details>
<summary><strong>DigitalOcean</strong></summary>

1. Go to [DigitalOcean Cloud Console](https://cloud.digitalocean.com)
2. Navigate to **API** > **Tokens**
3. Generate a personal access token with read and write scopes
4. Copy to `DIGITALOCEAN_API_TOKEN`

</details>

<details>
<summary><strong>Vultr</strong></summary>

1. Go to [Vultr Dashboard](https://my.vultr.com)
2. Navigate to **Account** > **API**
3. Enable the API and copy your API key
4. Copy to `VULTR_API_TOKEN`

</details>

<details>
<summary><strong>Firebase</strong></summary>

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** > **Sign-in method** > **Email/Password** (required for OTP login)
4. Add your domain to **Authorized domains**
5. For the web app: **Project Settings** > **General** > **Your apps** > Add a web app and copy config
6. For the API: **Project Settings** > **Service accounts** > Generate a new private key

**Google Sign-In:**

1. In **Authentication** > **Sign-in method**, enable **Google**
2. Set a project support email

**GitHub Sign-In:**

1. Create an OAuth App on [GitHub Developer Settings](https://github.com/settings/developers)
2. Set the **Authorization callback URL** to your Firebase callback URL (found in Firebase Console under the GitHub provider setup)
3. In **Authentication** > **Sign-in method**, enable **GitHub** and paste the Client ID and Client Secret from your GitHub OAuth App

All three sign-in methods (OTP, Google, GitHub) are always displayed in the UI, so all three must be configured in Firebase for a working setup. Users can also link/unlink Google and GitHub accounts from their Account settings page.

</details>

<details>
<summary><strong>Cloudflare</strong></summary>

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add your domain or select an existing one
3. Copy the **Zone ID** from the domain overview page
4. Create an API token with **Zone:DNS:Edit** permission
5. Copy Zone ID and API Token to your `.env`

</details>

<details>
<summary><strong>Polar.sh</strong></summary>

1. Go to [Polar.sh](https://polar.sh)
2. Create an organization and set up your products/subscriptions
3. Generate an access token and copy to `POLAR_ACCESS_TOKEN`
4. Copy your organization ID to `POLAR_ORGANIZATION_ID`
5. Configure webhook to point to your API's `/api/webhooks/polar` endpoint
6. Copy the webhook secret to `POLAR_WEBHOOK_SECRET`

</details>

### 4. Initialize Database

```bash
pnpm --filter api db:migrate
```

### 5. Start Development

```bash
pnpm dev
```

This starts both apps:

| App | URL                   |
| --- | --------------------- |
| Web | http://localhost:1111 |
| API | http://localhost:2222 |

The web dev server proxies `/api` requests to the API server automatically.

## Scripts

### Root Commands

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start all apps in development mode               |
| `pnpm dev:web`      | Start web app only                               |
| `pnpm dev:api`      | Start API only                                   |
| `pnpm dev:mobile`   | Start mobile app (Expo)                          |
| `pnpm dev:desktop`  | Start desktop app (Electron)                     |
| `pnpm build`        | Build all apps for production                    |
| `pnpm lint`         | Run ESLint across the monorepo                   |
| `pnpm lint:fix`     | Auto-fix ESLint issues                           |
| `pnpm format`       | Format all files with Prettier                   |
| `pnpm format:check` | Check formatting without writing                 |
| `pnpm check`        | Run TypeScript type-check + ESLint for all apps  |

### Database Commands

| Command                         | Description                                   |
| ------------------------------- | --------------------------------------------- |
| `pnpm --filter api db:generate` | Generate a new migration after schema changes |
| `pnpm --filter api db:migrate`  | Apply pending migrations                      |
| `pnpm --filter api db:studio`   | Open Drizzle Studio (database GUI)            |

### Email Development

```bash
pnpm --filter api email:dev    # Preview email templates at localhost:3333
```

## API Reference

### Public Endpoints

| Method | Endpoint                    | Description                      |
| ------ | --------------------------- | -------------------------------- |
| `POST` | `/api/auth/send-otp`        | Send OTP code via email          |
| `POST` | `/api/auth/verify-otp`      | Verify OTP and get Firebase token|
| `GET`  | `/api/plans`                | List available server plans      |
| `GET`  | `/api/plans/locations`      | List available regions           |
| `GET`  | `/api/plans/volume-pricing` | Get volume pricing               |
| `GET`  | `/api/plans/availability`   | Check plan availability          |

### Protected Endpoints (Bearer token required)

**Claws (Server Instances)**

| Method   | Endpoint                              | Description                     |
| -------- | ------------------------------------- | ------------------------------- |
| `GET`    | `/api/claws`                          | List user's claws               |
| `GET`    | `/api/claws/:id`                      | Get a specific claw             |
| `POST`   | `/api/claws`                          | Create a claw (direct)          |
| `POST`   | `/api/claws/purchase`                 | Initiate paid claw purchase     |
| `POST`   | `/api/claws/:id/sync`                 | Sync claw with cloud provider   |
| `POST`   | `/api/claws/:id/start`                | Start a claw                    |
| `POST`   | `/api/claws/:id/stop`                 | Stop a claw                     |
| `POST`   | `/api/claws/:id/restart`              | Restart a claw                  |
| `POST`   | `/api/claws/:id/cancel-deletion`      | Cancel scheduled deletion       |
| `DELETE` | `/api/claws/:id`                      | Delete a claw                   |
| `GET`    | `/api/claws/:id/export`               | Export claw configuration       |
| `POST`   | `/api/claws/:id/version`              | Get OpenClaw version            |

**Claw Diagnostics**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/diagnostics/status`   | Get server diagnostics          |
| `POST` | `/api/claws/:id/diagnostics/logs`     | Get server logs                 |

**Claw Agents**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/agents`               | List agents                     |
| `POST` | `/api/claws/:id/agents/create`        | Create a new agent              |
| `POST` | `/api/claws/:id/agents/delete`        | Delete an agent                 |
| `POST` | `/api/claws/:id/agent-config`         | Get agent configuration         |
| `PUT`  | `/api/claws/:id/agent-config`         | Update agent configuration      |

**Claw Channels**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/channels`             | Get configured channels         |
| `PUT`  | `/api/claws/:id/channels`             | Update channel configuration    |

**Claw Skills**

| Method | Endpoint                                    | Description                     |
| ------ | ------------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/skills`                     | Get claw skills                 |
| `PUT`  | `/api/claws/:id/skills`                     | Update claw skills              |
| `POST` | `/api/claws/:id/agents/:agentId/skills`     | Get agent-specific skills       |
| `PUT`  | `/api/claws/:id/agents/:agentId/skills`     | Update agent-specific skills    |

**ClawHub (Skills Marketplace)**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/clawhub/search`       | Search ClawHub skills           |
| `POST` | `/api/claws/:id/clawhub/installed`    | List installed skills           |
| `POST` | `/api/claws/:id/clawhub/install`      | Install a skill                 |
| `POST` | `/api/claws/:id/clawhub/remove`       | Remove a skill                  |
| `POST` | `/api/claws/:id/clawhub/update`       | Update a skill                  |
| `POST` | `/api/claws/:id/clawhub/updates`      | Check for available updates     |

**Claw Files & Environment**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `POST` | `/api/claws/:id/files`                | List files on instance          |
| `POST` | `/api/claws/:id/files/read`           | Read a file                     |
| `PUT`  | `/api/claws/:id/files`                | Update a file                   |
| `GET`  | `/api/claws/:id/env`                  | Get environment variables       |
| `PUT`  | `/api/claws/:id/env`                  | Update environment variables    |

**Admin Endpoints**

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `GET`  | `/api/claws/admin`                    | List all claws (admin only)     |
| `POST` | `/api/claws/:id/hard-delete`          | Permanently delete (admin only) |
| `POST` | `/api/claws/:id/diagnostics/repair`   | Repair instance (admin only)    |
| `POST` | `/api/claws/:id/reinstall`            | Reinstall OS (admin only)       |

**SSH Keys**

| Method   | Endpoint            | Description       |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/ssh-keys`     | List SSH keys     |
| `POST`   | `/api/ssh-keys`     | Add an SSH key    |
| `DELETE` | `/api/ssh-keys/:id` | Delete an SSH key |

**Users**

| Method   | Endpoint                                 | Description                  |
| -------- | ---------------------------------------- | ---------------------------- |
| `GET`    | `/api/users/me`                          | Get current user profile     |
| `PUT`    | `/api/users/me`                          | Update profile               |
| `GET`    | `/api/users/me/stats`                    | Get user stats               |
| `GET`    | `/api/users/me/billing`                  | Get billing history          |
| `GET`    | `/api/users/me/billing/:orderId/invoice` | Get invoice for an order     |
| `POST`   | `/api/users/me/billing/portal`           | Open Polar billing portal    |
| `POST`   | `/api/users/me/auth/:method`             | Connect auth method (Google/GitHub) |
| `DELETE` | `/api/users/me/auth/:method`             | Disconnect auth method       |

### Webhooks

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| `POST` | `/api/webhooks/polar` | Polar payment webhook |

## Deployment

### Web App

The web app builds to `apps/web/dist/` as a static SPA with pre-rendered pages and a generated sitemap. Deploy to any static hosting provider:

- **Vercel** (includes `vercel.json` with SPA rewrites)
- Cloudflare Pages
- Netlify
- Nginx / Apache

```bash
pnpm build
```

### API

The API runs as a Hono.js application on Node.js:

```bash
cd apps/api
pnpm build
pnpm start    # Starts on port 2222
```

## How It Works

When a user deploys a new claw, the platform:

1. **Creates a checkout** — Initiates a Polar.sh subscription for the selected plan
2. **Provisions a server** — Spins up a VPS on the chosen cloud provider (Hetzner, DigitalOcean, or Vultr)
3. **Runs cloud-init** — Automatically installs Node.js, OpenClaw, Nginx, SSL, and firewall
4. **Configures DNS** — Creates a Cloudflare subdomain pointing to the server IP
5. **Delivers access** — User gets a subdomain URL, root password, and SSH access

The `scripts/cloud-init.yaml` template configures every new instance with:

- Node.js 22 runtime
- OpenClaw (installed globally via npm)
- Nginx reverse proxy with WebSocket support
- Let's Encrypt SSL certificates
- UFW firewall (ports 22, 80, 443)
- systemd service for automatic OpenClaw startup

Once provisioned, users can manage their claws through the dashboard — configuring agents, channels, skills, environment variables, and files all remotely via SSH.

## Customization

### Subdomain Pattern

Instances get subdomains like `abc1234.yourdomain.com`. To use your own domain, update the Cloudflare zone configuration and the cloud-init template.

### Pricing Markup

The default pricing markup on cloud provider base prices is configurable in the plans controller.

### Cloud-Init

Modify `scripts/cloud-init.yaml` to customize what gets installed on new instances — add packages, change Node.js version, or configure additional services.

### Internationalization

All UI text is managed through `@openclaw/i18n`. Translation strings live in `packages/i18n/src/langs/en.ts`, organized by category (`common`, `nav`, `auth`, `dashboard`, `landing`, etc.).

## Troubleshooting

<details>
<summary><strong>SSL certificates not working</strong></summary>

Instances may take 1-2 minutes for SSL certificates to provision after the server boots. The cloud-init script includes retry logic for certificate generation. Ensure ports 80 and 443 are open.

</details>

<details>
<summary><strong>DNS not resolving</strong></summary>

New subdomains may take 1-5 minutes to propagate through Cloudflare. Check that your Cloudflare API token has Zone:DNS:Edit permission and the Zone ID is correct.

</details>

<details>
<summary><strong>Firebase auth not working</strong></summary>

1. Verify your domain is listed in Firebase **Authorized domains**
2. Confirm Email/Password sign-in is enabled under **Authentication** > **Sign-in method**
3. If using Google/GitHub auth, ensure those providers are configured
4. Double-check that all `VITE_FIREBASE_*` values match your Firebase project

</details>

<details>
<summary><strong>Database connection errors</strong></summary>

1. Verify `DATABASE_URL` is correct and includes `?sslmode=require` for hosted databases
2. Run `pnpm --filter api db:migrate` to apply any pending migrations
3. Use `pnpm --filter api db:studio` to inspect the database directly

</details>

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Make your changes following the project's code conventions
4. Run `pnpm check` to verify TypeScript and linting pass
5. Run `pnpm format` to ensure formatting is correct
6. Commit and push your changes
7. Open a pull request

## License

MIT License — see [LICENSE](LICENSE) for details.