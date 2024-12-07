# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on (assuming your app runs on port 8000)
EXPOSE 8000

# Command to run the application
CMD ["node", "index.js"]
