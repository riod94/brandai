# Operations Guide

## Development Setup

### Prerequisites

-  **Node.js**: Version 18.17 or later.
-  **Package Manager**: npm, pnpm, or bun (project uses `bun.lockb` but `npm` scripts are defined).
-  **Database**: PostgreSQL (Local or Cloud).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd brandai
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```ini
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brandai"

# Auth (NextAuth.js)
AUTH_SECRET="your-generated-secret-key"
AUTH_URL="http://localhost:3000" # Optional in Vercel

# OAuth Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Cloudinary (Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payments (Midtrans)
MIDTRANS_SERVER_KEY="your-server-key"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION="false"

# AI Services
HUGGINGFACE_API_KEY="your-hf-token"
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Database Operations

### Migrations

We use **Drizzle Kit** for database management.

-  **Generate Migrations**: Create SQL files based on schema changes.
   ```bash
   npm run db:generate
   ```
-  **Run Migrations**: Apply changes to the database.
   ```bash
   npm run db:migrate
   ```
-  **Studio**: Inspect the database UI.
   ```bash
   npm run db:studio
   ```

### Seeding Data

Populate the database with initial data (plans, default settings):

```bash
npm run db:seed
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository (GitHub/GitLab).
2. Import the project into Vercel.
3. Configure the **Environment Variables** in the Vercel dashboard matching your `.env`.
4. Deploy. Vercel automatically detects the Next.js build settings.

### Docker (Optional)

_Note: A Dockerfile is not currently included in the root, but can be added for containerized deployment._

---

## Maintenance & Monitoring

-  **Logs**: Check Vercel Runtime Logs or standard output for server errors.
-  **Webhooks**: Monitor Midtrans dashboard for failed payment webhook deliveries.
-  **Backups**: Ensure your PostgreSQL provider (e.g., Neon, Supabase, AWS RDS) has automated backups enabled.
