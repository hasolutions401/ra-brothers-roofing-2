#!/usr/bin/env bash
# Updates the Laravel API on the server after `git pull`. Run over SSH from
# the repository root on Hostinger:
#
#   bash deploy/hostinger/deploy.sh
#
# The GitHub Actions workflow .github/workflows/deploy-hostinger.yml runs it
# for you. Safe to run repeatedly.
set -euo pipefail

COMPOSER="${COMPOSER:-composer}"
cd "$(dirname "$0")/../../backend"

if [ ! -f .env ]; then
  echo "backend/.env is missing. Copy .env.hostinger.example to .env, fill it in, then run: php artisan key:generate" >&2
  exit 1
fi

php -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' || {
  echo "PHP $(php -r 'echo PHP_VERSION;') is too old; Laravel 13 needs 8.3+. Change it in hPanel > Advanced > PHP Configuration." >&2
  exit 1
}

php artisan down --retry=15 || true
trap 'php artisan up' EXIT

"$COMPOSER" install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-progress
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Folders PHP writes to; .env readable only by this account.
find storage bootstrap/cache -type d -exec chmod 775 {} +
find storage bootstrap/cache -type f -exec chmod 664 {} +
chmod 600 .env

echo "API deployed. Check: curl -s \"\$(grep ^APP_URL= .env | cut -d= -f2)/api/health\""
