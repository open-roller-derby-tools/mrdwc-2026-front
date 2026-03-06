# Build stage
FROM node:22-bullseye-slim AS builder

# Enable pnpm via Corepack (bundled with Node)
RUN corepack enable && corepack prepare pnpm@10.16.1 --activate

WORKDIR /build

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-bullseye-slim

WORKDIR /app/code

# Copy built application from builder stage
COPY --from=builder /build/.output ./.output

# Copy the start script
COPY cloudron/start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["/app/code/start.sh"]
