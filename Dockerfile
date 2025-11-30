# Use a lightweight Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 6969

# Start the server
CMD ["node", "src/main.js"]
