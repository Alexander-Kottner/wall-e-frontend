# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package configuration and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build
