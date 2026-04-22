#!/bin/bash
set -eu

# Set the Directus API base URL
export NUXT_PUBLIC_API_BASE="https://worldcup-dashboard.mrda.org"

# PostgreSQL - Cloudron injects CLOUDRON_POSTGRESQL_* env vars
echo "==> PostgreSQL: host=${CLOUDRON_POSTGRESQL_HOST} port=${CLOUDRON_POSTGRESQL_PORT} database=${CLOUDRON_POSTGRESQL_DATABASE} user=${CLOUDRON_POSTGRESQL_USERNAME}"
export DATABASE_URL="postgresql://${CLOUDRON_POSTGRESQL_USERNAME}:${CLOUDRON_POSTGRESQL_PASSWORD}@${CLOUDRON_POSTGRESQL_HOST}:${CLOUDRON_POSTGRESQL_PORT}/${CLOUDRON_POSTGRESQL_DATABASE}"

# Redis - Cloudron injects CLOUDRON_REDIS_* env vars
echo "==> Redis: host=${CLOUDRON_REDIS_HOST} port=${CLOUDRON_REDIS_PORT}"
export REDIS_URL="redis://:${CLOUDRON_REDIS_PASSWORD}@${CLOUDRON_REDIS_HOST}:${CLOUDRON_REDIS_PORT}"

# Load env vars from persistent storage
if [ -f /app/data/.env ]; then
	set -a
	# shellcheck disable=SC1091
	source /app/data/.env
	set +a
fi

# Start the Nuxt server
exec node ./.output/server/index.mjs
