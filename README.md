# OpenClaw.Anywhere

A self-hostable cloud hosting management platform that provides a streamlined dashboard for managing Hetzner Cloud servers with automatic SSL, DNS configuration, and SSH key management.

## Features

- **Instance Management** - Create, start, stop, restart, and delete Hetzner Cloud servers
- **Automatic SSL** - Auto-configured HTTPS via Let's Encrypt for every instance
- **DNS Management** - Automatic subdomain creation via Cloudflare
- **SSH Key Management** - Store and assign SSH keys to instances
- **Storage Volumes** - Create and attach persistent storage
- **Passwordless Auth** - Firebase email link authentication

## Architecture

```
openclaw.anywhere/
├── apps/
│   ├── api/          # Hono.js backend (Node.js)
│   └── web/          # React frontend (Vite)
├── packages/
│   └── shared/       # Shared TypeScript utilities
└── scripts/
    └── cloud-init.yaml   # Instance initialization template
```

## Prerequisites

- **Node.js** 22+
- **pnpm** 9.14+
- **PostgreSQL** database (Neon, Supabase, or self-hosted)

### External Services

You'll need accounts and API credentials for:

| Service                                          | Purpose             | What You Need       |
| ------------------------------------------------ | ------------------- | ------------------- |
| [Hetzner Cloud](https://console.hetzner.cloud/)  | Server provisioning | API Token           |
| [Firebase](https://console.firebase.google.com/) | Authentication      | Project credentials |
| [Cloudflare](https://dash.cloudflare.com/)       | DNS management      | API Token + Zone ID |

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-username/openclaw.anywhere.git
cd openclaw.anywhere
pnpm install
```

### 2. Configure Environment Variables

#### API Configuration

Create `apps/api/.env`:

```bash
# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Hetzner Cloud
HETZNER_API_TOKEN=your-hetzner-api-token

# Cloudflare DNS
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Server
PORT=2222
```

#### Web Configuration

Create `apps/web/.env`:

```bash
# Firebase Client SDK
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Setup External Services

#### Hetzner Cloud

1. Go to [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Create a new project or select existing
3. Navigate to **Security** → **API Tokens**
4. Generate a new token with **Read & Write** permissions
5. Copy the token to `HETZNER_API_TOKEN`

#### Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Sign-in method** → **Email link (passwordless)**
4. Add your domain to **Authorized domains**
5. For the web app:
    - Go to **Project Settings** → **General** → **Your apps**
    - Add a web app and copy the config values
6. For the API:
    - Go to **Project Settings** → **Service accounts**
    - Generate a new private key (downloads JSON)
    - Extract `project_id`, `client_email`, and `private_key` from the JSON

#### Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Add your domain (e.g., `clawhost.cloud`) or use an existing one
3. Get your **Zone ID** from the domain overview page
4. Create an API token:
    - Go to **My Profile** → **API Tokens**
    - Create a token with **Zone:DNS:Edit** permission for your zone
5. Copy Zone ID and API Token to your `.env`

### 4. Initialize Database

```bash
cd apps/api
pnpm db:migrate
```

### 5. Start Development Servers

```bash
# From root directory
pnpm dev
```

This starts:

- API server at `http://localhost:2222`
- Web app at `http://localhost:1111`

## Production Deployment

### Build

```bash
pnpm build
```

### Run API

```bash
cd apps/api
pnpm start
```

### Deploy Web

The web app builds to `apps/web/dist/`. Deploy this directory to any static hosting:

- Vercel
- Netlify
- Cloudflare Pages
- Nginx/Apache

### Environment-Specific Configuration

For production, update the web app's API base URL. Edit `apps/web/src/lib/api.ts` or set up environment-based configuration to point to your production API URL.

## Database Migrations

```bash
cd apps/api

# Generate new migration after schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Customization

### Subdomain Pattern

Instances are assigned subdomains like `abc1234.yourdomain.com`. To change the base domain:

1. Update your Cloudflare zone
2. Modify the subdomain generation in `apps/api/src/routes/instances.ts`
3. Update the cloud-init template in `scripts/cloud-init.yaml`

### Pricing Markup

The default 20% markup on Hetzner prices can be adjusted in `apps/api/src/routes/plans.ts`.

### Cloud-Init Script

The instance initialization script at `scripts/cloud-init.yaml` installs:

- Node.js 22
- Nginx with reverse proxy
- Let's Encrypt SSL certificates
- OpenClaw gateway service
- UFW firewall

Modify this file to customize what gets installed on new instances.

## API Endpoints

### Public

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/plans`                | Available server types |
| GET    | `/api/plans/locations`      | Available regions      |
| GET    | `/api/plans/volume-pricing` | Volume pricing         |

### Protected (requires auth)

| Method | Endpoint                     | Description      |
| ------ | ---------------------------- | ---------------- |
| GET    | `/api/instances`             | List instances   |
| POST   | `/api/instances`             | Create instance  |
| DELETE | `/api/instances/:id`         | Delete instance  |
| POST   | `/api/instances/:id/start`   | Start instance   |
| POST   | `/api/instances/:id/stop`    | Stop instance    |
| POST   | `/api/instances/:id/restart` | Restart instance |
| GET    | `/api/ssh-keys`              | List SSH keys    |
| POST   | `/api/ssh-keys`              | Create SSH key   |
| DELETE | `/api/ssh-keys/:id`          | Delete SSH key   |
| GET    | `/api/users/me`              | Current user     |
| PUT    | `/api/users/me`              | Update profile   |

## Tech Stack

**Backend**

- [Hono](https://hono.dev/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Firebase Admin](https://firebase.google.com/docs/admin/setup) - Auth verification

**Frontend**

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## Troubleshooting

### SSL Certificate Issues

Instances may take 1-2 minutes for SSL certificates to be provisioned. The cloud-init script includes a 60-second retry loop for certificate generation.

### DNS Propagation

New subdomains may take a few minutes to propagate. Cloudflare typically updates within 1-5 minutes.

### Firebase Auth Not Working

1. Ensure your domain is added to Firebase authorized domains
2. Check that email link sign-in is enabled
3. Verify the Firebase config values match your project

### Database Connection Errors

1. Verify your `DATABASE_URL` is correct
2. Ensure SSL mode is enabled for hosted databases
3. Check that migrations have been applied

## License

MIT License - see [LICENSE](LICENSE) for details.
