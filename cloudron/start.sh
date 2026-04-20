#!/bin/bash
set -eu

# Set the Directus API base URL
export NUXT_PUBLIC_API_BASE="https://worldcup-dashboard.mrda.org"

# Load env vars from persistent storage
if [ -f /app/data/.env ]; then
	set -a
	# shellcheck disable=SC1091
	source /app/data/.env
	set +a
fi

# Start the Nuxt server
exec node ./.output/server/index.mjs
