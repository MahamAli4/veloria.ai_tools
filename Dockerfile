# Use Node.js official image
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency configs
COPY package.json package-lock.json ./

# Install packages
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the project with the node-server preset for Hostinger compatibility
ENV NITRO_PRESET=node-server
RUN npm run build

# Use a clean production runtime image
FROM node:22-alpine

WORKDIR /app

# Copy only the compiled output and static assets from builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

# Set production host environment variable
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the compiled Node.js SSR server
CMD ["node", ".output/server/index.mjs"]
