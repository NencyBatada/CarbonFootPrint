# Use official Node image for building the app
FROM node:20-alpine AS builder
WORKDIR /app
# Install dependencies (including pnpm or npm)
COPY package*.json ./
RUN npm install
# Copy source files
COPY . .
# Build the Vite app
RUN npm run build

# Use lightweight Nginx to serve the built files
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 8080 (Cloud Run expects $PORT env var, but default nginx listens on 80; we change to 8080)
EXPOSE 8080
# Update nginx configuration to listen on 8080
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
