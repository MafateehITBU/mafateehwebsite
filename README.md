# mafateehwebsite

## Backend database

The API expects PostgreSQL. The repo includes Docker Compose (`backend/docker-compose.yml`) on **host port 5433** so it does not fight with another Postgres on **5432**.

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or any Docker engine).
2. From `backend`:

   ```bash
   npm run db:setup
   ```

   This starts the DB container, applies migrations, and runs the seed (default admin: `admin@mafateeh.local` / `ChangeMe_Admin123!` unless overridden by env).

3. Start the API:

   ```bash
   npm run dev
   ```

If Docker is not available, configure Postgres in `backend/.env`:

- Set **`POSTGRES_PASSWORD`** to the same password you use in pgAdmin (along with `POSTGRES_USER`, host, port, and database if they differ), **or**
- Set a full **`DATABASE_URL`**.

Then from `backend` run:

```bash
npm run db:init
```

That applies migrations and seeds the admin user (same defaults as above).

## Admin dashboard

From `admin-dashboard`:

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000`.
