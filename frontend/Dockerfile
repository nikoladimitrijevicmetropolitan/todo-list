# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency configs and install them
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files and build
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine

# Copy the custom Nginx configuration (we will create this in the next step)
# to handle client-side routing in React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build assets from build stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
