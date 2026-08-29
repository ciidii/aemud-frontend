# ==============================================================================
# Stage 1: Build Angular Frontend
# ==============================================================================
FROM node:22-alpine AS build
WORKDIR /app

# Cache package dependencies layer
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install

# Build production bundle with AOT & optimization
COPY . .
RUN npm run build:prod

# ==============================================================================
# Stage 2: Serve via High-Performance Nginx
# ==============================================================================
FROM nginx:1.27-alpine AS runtime

# Copy custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist/amued-frontend /usr/share/nginx/html

EXPOSE 80

# Container Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
