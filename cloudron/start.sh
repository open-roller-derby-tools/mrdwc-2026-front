#!/bin/bash
set -eu

# Set the Directus API base URL
export NUXT_PUBLIC_API_BASE="https://worldcup-dashboard.mrda.org"

# Start the Nuxt server
exec node ./.output/server/index.mjs
