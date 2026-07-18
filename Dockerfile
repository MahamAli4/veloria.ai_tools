# Use official Node.js runtime as a parent image (alpine is already cached locally)
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

# Set work directory
WORKDIR /app

# Copy only the compiled output and package config from the host Windows machine
COPY .output /app/.output
COPY package.json /app/package.json

EXPOSE 3000

# Set production host environment variable
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the compiled Node.js SSR server
CMD ["node", ".output/server/index.mjs"]
