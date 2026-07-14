# Use official Node.js runtime as a parent image (alpine is already cached locally)
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

# Set work directory
WORKDIR /app

# Copy the backend project code (including locally installed node_modules)
COPY . /app/

# Expose port 8000
EXPOSE 8000

# Start Node server
CMD ["node", "index.js"]
