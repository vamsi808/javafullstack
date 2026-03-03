# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
# Use --frozen-lockfile if you have a lockfile, but npm install is usually safer here
RUN npm install
COPY . .
# Explicitly set permissions for the bin folder just in case
RUN chmod +x node_modules/.bin/vite
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
