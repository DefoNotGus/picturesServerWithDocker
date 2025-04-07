# Use the official Node.js image
FROM node:16

# Set the working directory for the React app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app files
COPY . .

# Build the React app
RUN npm run build

# Install the serve package to serve the build folder
RUN npm install -g serve

# Expose the port that the app will run on
EXPOSE 3000

# Run the app
CMD ["serve", "-s", "build"]
