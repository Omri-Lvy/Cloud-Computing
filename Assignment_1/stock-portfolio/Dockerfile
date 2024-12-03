FROM node:18-alpine
LABEL authors="Omri Levy, Roy Harel, Omer Har-Zvi"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5001

# Serve the app
CMD ["npm", "start"]