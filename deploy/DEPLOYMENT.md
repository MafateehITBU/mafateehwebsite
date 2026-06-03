# Production Deployment (Backend + Frontend + Dashboard)

This setup deploys:
- `api.mafateehgroup.com` -> backend API
- `mafateehgroup.com` + `www.mafateehgroup.com` -> website
- `dashboard.mafateehgroup.com` + `www.dashboard.mafateehgroup.com` -> dashboard

It uses Docker Compose, Nginx reverse proxy, and Certbot.

## 1) DNS records to add

Create these records pointing to `187.124.173.216`:

- `A` record: `@` -> `187.124.173.216`
- `A` record: `www` -> `187.124.173.216`
- `A` record: `api` -> `187.124.173.216`
- `A` record: `dashboard` -> `187.124.173.216`
- `A` record: `www.dashboard` -> `187.124.173.216`

Optional:
- Add `CAA` for Let's Encrypt if you use CAA restrictions.

## 2) One-time server bootstrap (brand new server)

SSH to server:

```bash
ssh root@187.124.173.216
```

Create app path:

```bash
mkdir -p /opt/mafateehwebsite
```

## 3) GitHub auto-deploy (self-hosted runner)

GitHub cloud runners **cannot SSH** to this VPS (Hostinger blocks inbound port 22 from GitHub).
Use a **self-hosted runner** on the server instead.

### One-time runner setup (on server)

1. Open: https://github.com/MafateehITBU/mafateehwebsite/settings/actions/runners/new
2. Choose **Linux** → copy the registration token (valid ~1 hour)
3. On the server:

```bash
cd /opt/mafateehwebsite
bash deploy/scripts/setup-github-runner.sh YOUR_RUNNER_TOKEN
```

4. In GitHub → Runners, confirm **srv1719442** is **Idle**

After that, every push to `main` runs deploy on the VPS (no SSH from GitHub needed).

### Optional SSH secrets (legacy cloud deploy — not used)

If you ever open port 22 to GitHub IPs, you could use cloud runners with:
- `PROD_HOST`, `PROD_USER`, `PROD_APP_DIR`, `PROD_SSH_PRIVATE_KEY`

```bash
bash deploy/scripts/issue-ssl.sh your@email.com
```

**Important:** `PROD_APP_DIR` must be exactly `/opt/mafateehwebsite` with **no extra line breaks** in the GitHub secret.

## 4) Initial files and env on server

Run one initial sync manually (or push once after secrets are set so workflow syncs files).

On server, run:

```bash
cd /opt/mafateehwebsite
bash deploy/scripts/setup-server.sh your-email@example.com
```

Edit env files:
- `/opt/mafateehwebsite/deploy/config/backend.env`
- `/opt/mafateehwebsite/deploy/config/postgres.env`

Important:
- Use same DB password in both files.
- Set strong `JWT_SECRET`.
- Fill Cloudinary values if needed.

## 5) First deploy + certificate issuance

Run this once with your email:

```bash
cd /opt/mafateehwebsite
bash deploy/scripts/deploy.sh your-email@example.com
```

After first successful certificate issuance, future deploys can run without email:

```bash
bash deploy/scripts/deploy.sh
```

## 6) Auto deploy on push

Workflow file:
- `.github/workflows/deploy-production.yml`

Trigger:
- Push to `main` branch.

What it does:
1. Syncs repository files to server with `rsync`
2. Runs `bash deploy/scripts/deploy.sh` on server

## 7) Notes

- Certbot renewal is configured via cron at `03:00` daily.
- Backend migrations run automatically on backend container startup (`npm run db:deploy`).
