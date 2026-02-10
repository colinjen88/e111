
# 🚀 Deployment Guide

## 1. Vercel (Recommended for Nuxt 3)

Vercel is the easiest way to deploy Nuxt applications. It automatically detects the project and sets up the build command.

1.  **Create a Account**: Sign up at [vercel.com](https://vercel.com/).
2.  **Import Git Repository**: Connect your GitHub/GitLab account and import `e111-booking`.
3.  **Environment Variables**:
    - `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Supabase or Neon).
    - `ADMIN_PASSWORD`: Secure password for the admin panel.
    - `LINE_NOTIFY_TOKEN`: Your API token (if using real integration).
    - `SENDGRID_API_KEY`: Your API key (if using SendGrid).
4.  **Database Migration**:
    - During build, set `prisma migrate deploy` as a post-install hook.
    - Alternatively, allow Vercel to handle basic migrations or run them locally pointing to prod DB.
5.  **Build Settings**:
    - Nuxt Preset: `nitro` (Recommended) or `vercel`.
    - Build Command: `npm run build` or `npx nuxi build`.
    - Output Directory: `.output` (Default).

## 2. Manual Deployment (VPS / DigitalOcean / Linode)

For full control, deploy on a Linux server using PM2 and Nginx.

1.  **Clone Repository**:
    ```bash
    git clone https://github.com/your-repo/e111-booking.git
    cd e111-booking
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment**:
    Create `.env` file with production variables.
    ```bash
    cp .env.example .env
    nano .env
    ```
4.  **Build Application**:
    ```bash
    npm run build
    ```
5.  **Run with PM2**:
    ```bash
    npm install -g pm2
    pm2 start .output/server/index.mjs --name "e111-booking"
    pm2 save
    ```
6.  **Configure Nginx** (Reverse Proxy):
    Point Nginx to `http://localhost:3000`.

## 3. Database Consideration (PostgreSQL)

Since SQLite is file-based and not ideal for serverless deployments (like Vercel functions which are stateless), switch to **PostgreSQL**.

1.  **Update `schema.prisma`**:
    Change `provider = "sqlite"` to `"postgresql"`.
2.  **Get a Database**: use **Supabase**, **Neon**, or **Railway** (Free tiers available).
3.  **Migrate**:
    ```bash
    npx prisma migrate deploy
    ```
4.  **Seed Data**:
    ```bash
    npx prisma db seed
    ```

## 4. Environment Variables Checklist

Ensure these variables are set in production:

- `DATABASE_URL`: `postgresql://user:password@host:port/database`
- `ADMIN_PASSWORD`: `YourStrongPassword`
- `NUXT_PUBLIC_API_BASE`: (Optional) If using separate API domain.
