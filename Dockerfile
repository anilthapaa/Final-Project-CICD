# Stage 1: Build React app
FROM node:18-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build React app for production
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React files from build stage to NGINX's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
