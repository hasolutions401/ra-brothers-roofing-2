# RA Brothers Roofing — forms API and admin dashboard

The website's two forms send to this Laravel 13 API, which stores every request
in MySQL. Staff read and manage them in a dashboard at `/admin/` on the website
itself.

```
Browser ── https://your-domain/            static Next.js export (the website + /admin pages)
        └─ https://your-domain/api/...     this Laravel app (same domain, so no CORS and no
                                            third-party cookies)
                                  └─ MySQL  submissions, submission_photos, users
```

- **Public:** `POST /api/submissions` stores the quick form (home page) and the four-step estimate
  form (`/free-estimate/`, service and town pages), with up to 8 roof photos.
- **Admin:** one account, created from `.env`. Sanctum cookie sessions: the login lives in an
  httpOnly cookie that page scripts cannot read, with CSRF protection on every change.
- **Dashboard:** overview counts, search, filters, sorting, pagination, full details with photos,
  status (new / read / contacted), delete, CSV export.

Contents: [Local development](#local-development) · [Database](#database-schema) ·
[API](#api) · [Security](#security) · [Deploy to alwaysdata](#deploy-to-alwaysdata) ·
[Maintenance](#maintenance) · [Troubleshooting](#troubleshooting)

---

## Local development

You need **Node 22+**, **PHP 8.3+** and **Composer**, plus **MySQL** (or SQLite for a quick start).
On Windows, [Laragon](https://laragon.org/download/) installs PHP, Composer and MySQL together.

```powershell
# 1. The API (in backend/)
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Create an empty database called `ra_roofing` (Laragon: *Database* button, or
`mysql -u root -e "CREATE DATABASE ra_roofing"`). To skip MySQL, set `DB_CONNECTION=sqlite` and
`DB_DATABASE=` the full path of an empty `database/database.sqlite` file.

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then:

```powershell
php artisan migrate --seed                               # tables + your admin account
php artisan db:seed --class=DemoSubmissionSeeder        # optional: 60 fake leads to click through
php artisan serve                                        # http://localhost:8000
```

```powershell
# 2. The website (repository root, second terminal)
copy .env.example .env.local        # API_URL=http://localhost:8000/api
npm install
npm run dev                         # http://localhost:3000/
```

Sign in at <http://localhost:3000/admin/login/>.

Without `API_URL` the forms stay in their honest preview mode ("nothing was sent").

```powershell
php artisan test        # in backend/: 42 tests, SQLite in memory
npm run lint; npm run typecheck
```

---

## Database schema

**`submissions`**: one row per form sent.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `form_type` | VARCHAR(20) | `quick` or `estimate` |
| `status` | VARCHAR(20), default `new` | `new`, `read`, `contacted` |
| `name`, `phone` | VARCHAR(120), VARCHAR(30) | phone stored as `(603) 555-1234` |
| `phone_digits` | VARCHAR(15), indexed | `6035551234`, so searches match any format |
| `email` | VARCHAR(190) NULL | the quick form has none |
| `town`, `address` | VARCHAR(120) NULL, VARCHAR(255) NULL | |
| `service` | VARCHAR(120) NULL | quick form "What you need" / estimate form service |
| `message` | TEXT NULL | notes |
| `details` | JSON NULL | estimate answers: `property_type`, `roof_age`, `conditions[]`, `insurance`, `estimate_type`, `best_time` |
| `source_page` | VARCHAR(255) NULL | page the form was sent from, e.g. `/services/roof-repair/` |
| `ip_address`, `user_agent` | VARCHAR(45) NULL, VARCHAR(500) NULL | |
| `read_at`, `contacted_at` | TIMESTAMP NULL | set with the status |
| `created_at`, `updated_at` | TIMESTAMP | stored in UTC |

Indexes: `(status, created_at)`, `(form_type, created_at)`, `created_at`, `phone_digits`.
Anything the dashboard searches, filters, sorts or lists is a real column; answers that only
appear in the detail view live in `details`, so a new estimate question needs no migration.

**`submission_photos`**: `id`, `submission_id` (FK, deleted with its submission), `path` (private
disk, `storage/app/private/submissions/{id}/`), `original_name`, `mime_type`, `size`, timestamps.

**`users`**: admin accounts: `id`, `name`, `email` (unique), `password` (bcrypt), `remember_token`,
`last_login_at`, timestamps. Created only by `AdminUserSeeder`; there is no registration.

**`migrations`**: Laravel's record of which migrations have run.

Sessions, cache and rate-limit counters are files in `storage/framework/`, so no other tables are
needed and nothing extra has to run on shared hosting.

---

## API

All under `/api`. JSON in and out; validation errors are `422` with
`{"message": "...", "errors": {"field": ["..."]}}`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/submissions` | public · 5 per 10 min and 20 per day per IP | Store a form (multipart when photos are attached) |
| GET | `/health` | public | `{"status":"ok"}` when PHP, Laravel and the database all work |
| GET/POST | `/setup` | one-time token, see below | Browser-based database setup for hosts without SSH |
| GET | `/sanctum/csrf-cookie` | public | Sets the `XSRF-TOKEN` cookie before sign-in |
| POST | `/admin/login` | 5 per minute per email and IP | Sign in (email, password) |
| POST | `/admin/logout` | admin | Sign out |
| GET | `/admin/me` | admin | The signed-in admin |
| GET | `/admin/stats` | admin | Total, new, today, this week (business time zone) |
| GET | `/admin/submissions` | admin | `search`, `form_type`, `status`, `from`, `to` (`YYYY-MM-DD`), `sort`, `dir`, `page`, `per_page` |
| GET | `/admin/submissions/export` | admin | CSV of the same filters |
| GET | `/admin/submissions/{id}` | admin | Full details; marks a new submission as read |
| PATCH | `/admin/submissions/{id}` | admin | `{"status": "new" \| "read" \| "contacted"}` |
| DELETE | `/admin/submissions/{id}` | admin | Permanently, with its photos |
| GET | `/admin/submissions/{id}/photos/{photo}` | admin | One private photo |

**Form fields.** Both forms send `form_type`, `name`, `phone` (10-digit US), and optionally
`email`, `town`, `service`. The estimate form adds `property_type`, `roof_age`, `conditions[]`,
`insurance`, `town` (required), `address`, `estimate_type`, `best_time`, `notes` and `photos[]`.
Allowed choices live in [`config/form-options.json`](config/form-options.json), which the website
imports too, so the two can never disagree. Every submission also carries `source_page`,
`elapsed_ms` and the empty honeypot field `hp_extra_info`.

---

## Security

- **Passwords.** Bcrypt (`hashed` cast). The admin comes from `.env` via a seeder; there is no
  registration or password-reset form to attack.
- **Sessions.** Sanctum SPA authentication: a session cookie that is `HttpOnly`, `SameSite=Lax` and
  `Secure` in production, and expires after 2 hours idle. No token is stored in the browser. Any
  401/419 signs the dashboard out ("Your session ended").
- **CSRF.** Required on sign-in and on every change (`X-XSRF-TOKEN`). Sessions only start for
  requests coming from the site's own domain (`SANCTUM_STATEFUL_DOMAINS`, which defaults to
  `APP_URL`'s host).
- **CORS.** Only `FRONTEND_URL`'s origin, with credentials. In production the site and API share a
  domain, so browsers never need it.
- **Spam.** Per-IP rate limits, a hidden honeypot field, and a minimum fill time. Bots get the same
  "thank you" as people, and nothing is stored.
- **Validation.** Form Requests with the forms' own wording. Choices must come from the allowed
  lists. Text is stripped of control and invisible characters and stored as typed. It is escaped
  wherever it is shown: React, the email (Markdown escaped too) and the CSV, where formula-like
  cells such as `=HYPERLINK(...)` are neutralised.
- **Database.** Eloquent and the query builder only, with parameter binding throughout.
- **Photos.** Resized in the browser, then re-encoded by the server to plain JPEG, which strips
  camera metadata including GPS location. They are stored outside the web root and served only to
  a signed-in admin through scoped routes.
- **Headers.** API responses send `nosniff`, `X-Frame-Options: DENY`, `noindex` and a
  `Permissions-Policy`; JSON also gets `Content-Security-Policy: default-src 'none'` and personal
  data is `no-store`. On alwaysdata, `deploy/alwaysdata/htaccess-root` adds HSTS to everything and
  a Content-Security-Policy and Permissions-Policy to the pages. Laravel's folder is never served
  directly (see `deploy/`).
- **Admin sign-in.** One account, from `.env`; five attempts a minute per account and IP, twenty
  per IP. Every lead, photo, export, status and delete route requires the signed-in session
  (`routes/api.php`). There is no two-factor sign-in yet: use a long, unique password.
- **Production.** `APP_DEBUG=false` and `APP_ENV=production`. Secrets live only in `backend/.env`
  on the server. The website's code contains nothing secret: its only setting is the public
  `API_URL`.
- **Client IPs.** `TRUSTED_PROXIES` defaults to Cloudflare's published ranges, so real visitor IPs
  are used for rate limiting without letting anyone else forge `X-Forwarded-For`.

---

## Deploy to alwaysdata

Live at <https://rabrothersroofing.alwaysdata.net>. Every push to `main` deploys automatically
through `.github/workflows/deploy-alwaysdata.yml` (see the root README, *Deploying to
alwaysdata*): tests, build, upload, `php artisan migrate --force` and fresh caches. The site and
API share one domain:

```
~/www/htdocs/              ← the alwaysdata site's root
├── .htaccess              ← deploy/alwaysdata/htaccess-root: serves the site, sends /api/* to
│                            Laravel, refuses any direct request for /backend/...
├── index.html, 404.html, _next/, images/, services/, free-estimate/, admin/ ...  (the website)
└── backend/               ← the whole Laravel app, including vendor/
    ├── .htaccess          ← "deny all"
    ├── .env               ← production settings (never touched by a deploy)
    ├── storage/           ← customer photos and logs (never touched by a deploy)
    └── public/.htaccess   ← allows index.php only
```

- **Settings:** `backend/.env` on the server, documented in `.env.alwaysdata.example`. After
  changing it, run `php artisan config:cache` in `~/www/htdocs/backend` over SSH
  (`ssh rabrothersroofing@ssh-rabrothersroofing.alwaysdata.net`), because the cached settings win.
- **New-lead emails:** alwaysdata SMTP, set in `MAIL_*` and `LEAD_NOTIFY_EMAIL`. Check with
  `php artisan leads:test-email`.
- **Check after a deploy:** `/api/health` shows `{"status":"ok","database":"connected","migrated":true}`.
  Send a form, then sign in at `/admin/login/` and open the lead.

---

## Maintenance

- **Reset the admin password:** change `ADMIN_PASSWORD` in `.env`, then run
  `php artisan db:seed --class=AdminUserSeeder --force`. Without SSH, delete
  `storage/app/setup.lock`, set `SETUP_TOKEN` and use `/api/setup`. The seeder updates the
  existing account.
- **A different admin email:** the seeder creates a second account. Delete the old row in
  phpMyAdmin (`users`) if you no longer want it.
- **Change a form choice:** edit `config/form-options.json`. Then rebuild and redeploy **both** the
  website and the API. The build fails if a service in `src/lib/services.ts` is missing from the
  file.
- **Check email delivery:** `php artisan leads:test-email` (to `LEAD_NOTIFY_EMAIL`) or
  `php artisan leads:test-email someone@example.com`. It prints the mail server's error if sending
  fails; the website itself never shows mail errors, so a lead is never lost to one.
  `LEAD_CONFIRM_CUSTOMER=true` also sends customers who gave an email a "we received your
  request" note.
- **Logs:** `storage/logs/laravel.log`. Discarded spam is logged at `info` level.
- **Backups:** export the database from phpMyAdmin now and then, and keep
  `storage/app/private/submissions/` (photos).

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `/api/health` shows the site's 404 page | The root `.htaccess` is missing (hidden files not uploaded) or `mod_rewrite` is off. |
| `/api/health` is `503` with `"database":"unreachable"` | Wrong `DB_*` values; on alwaysdata the host is `mysql-rabrothersroofing.alwaysdata.net`, not `localhost`. |
| `/api/health` is `503` with `"migrated":false` | Tables not created yet: `php artisan migrate --force` (or `/api/setup` without SSH). |
| Blank page or `500` | Read `backend/storage/logs/laravel.log`. Usually a missing `APP_KEY`, an unwritable `storage/`, or PHP older than 8.3. |
| Sign-in says *Sign in from the website's admin page* | The request did not come from `APP_URL`'s host (e.g. `www` vs bare domain). Set `SANCTUM_STATEFUL_DOMAINS=example.com,www.example.com`, and redirect to one host. |
| Sign-in returns *Your session has expired* (419) | Cookies not kept: `SESSION_SECURE_COOKIE=true` while using http, or the browser blocks cookies for the site. |
| A form says *The server did not answer properly* | The host answered with an HTML page (an error page). Reload the page and send again. |
| Every lead shows the same IP | A proxy in front of PHP. Find its address ranges and set `TRUSTED_PROXIES` to them. Only use `*` if the server cannot be reached any other way. |
| Photos fail with *too large* | The host's upload limit. The website sends at most 8 resized photos (about 5 MB), so this usually means the site bundle is outdated; rebuild it. |
| Changed `.env` on the server, nothing happened | `php artisan config:cache`. |
