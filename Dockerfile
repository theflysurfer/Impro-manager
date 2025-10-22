# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy client package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy client source
COPY client/ ./

# Build frontend
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy root package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/client/dist ./backend/public/client

# Copy data files
COPY data/ ./data/
COPY music_library.json ./data/music/

# Create necessary directories
RUN mkdir -p /app/public/music /app/logs /app/uploads

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application (use production version)
CMD ["node", "app.production.js"]
