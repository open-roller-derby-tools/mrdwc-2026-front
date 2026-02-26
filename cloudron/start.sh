#!/bin/bash
set -e

export PORT="${PORT:-3000}"
exec node /app/code/.output/server/index.mjs
