FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* npm-shrinkwrap.json* ./

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the app (frontend + server)
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
