FROM node:20-slim

WORKDIR /app

# Install dependencies for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev for TypeScript build)
RUN npm install

# Copy source
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript
RUN npx tsc

# Download model at build time
RUN node dist/download-model.js

# Remove dev dependencies to slim the image
RUN npm prune --omit=dev

EXPOSE 3100

CMD ["node", "dist/index.js"]
