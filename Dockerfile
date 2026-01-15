# Use official Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY app/ .

# Build the Angular application
RUN npm run build

# Use a multi-stage build to create a smaller production image
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist/app/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
