# Use an official Node.js runtime as the base image
FROM node:19

# Set the working directory in the container to /app
WORKDIR /app

# Copy the server's package.json and package-lock.json files to the container
COPY server/package*.json ./server/

# Install the server's dependencies
WORKDIR /app/server
RUN npm install

# Copy the client's package.json and package-lock.json files to the container
WORKDIR /app
COPY client/package*.json ./client/

# Install the client's dependencies
WORKDIR /app/client
RUN npm install

# Copy the rest of the app's files to the container
WORKDIR /app
COPY . .

# Specify the command to run the client and server in parallel
CMD ["sh", "-c", "  cd server && npm start & export NODE_OPTIONS=--openssl-legacy-provider && cd client && npm start "]
#CMD ["sh", "-c", "cd server && npm start "]

# Expose the container's port 3000 for the client and 3001 for the server
EXPOSE 3000
EXPOSE 3001
