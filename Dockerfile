# Use a newer Node.js runtime (with updated GLIBC)
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the application using the same command as in your instructions
CMD ["npm", "start"]

