# Multi-stage lightweight Node.js container
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install dependencies required for sqlite3 build
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose API port
EXPOSE 5000

# Docker healthcheck querying our /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
