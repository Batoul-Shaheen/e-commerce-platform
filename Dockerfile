# The base image that will have node dep
FROM node:20

# Set the current working directory in the container
WORKDIR /usr/app

# Copy only two files to the image
COPY package.json package-lock.json ./

# Execute a command while building the container
RUN npm ci

# Install application dependencies
RUN npm install

# Now copy the project files
ADD . . 

# Expose a port for your Node.js application to listen on
EXPOSE 3000

# When running the container, execute the following command
CMD ["npm", "run" , "dev"]
