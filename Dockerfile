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

# Install Python, pip, ffmpeg and build dependencies for Python packages
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    gcc \
    g++ \
    make \
    python3-dev \
    musl-dev \
    linux-headers \
    && ln -sf python3 /usr/bin/python

# Copy root package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy and install Python requirements
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/client/dist ./backend/public/client

# Create necessary directories
RUN mkdir -p /app/data/music /app/public/music /app/logs /app/uploads

# Copy data files
COPY data/ ./data/
COPY music_library.json ./data/music/

# Copy Python downloader script
COPY youtube_downloader.py ./

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application (use production version)
CMD ["node", "app.production.js"]
