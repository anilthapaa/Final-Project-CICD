# Official NGINX base image
FROM nginx:alpine

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app into NGINX's web directory
COPY build/ /usr/share/nginx/html

# Expose port (optional for testing)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]