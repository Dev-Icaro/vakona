FROM node:18-alpine
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json yarn.lock ./

# Install PM2 and yarn globally
RUN npm install pm2 -g

# Install dependencies
RUN yarn install

# Bundle app source inside Docker image (by copying from your machine)
COPY . .

# Transpile TypeScript into JavaScript
RUN yarn build

# Define the command to run your app using CMD which defines your runtime
CMD [ "pm2-runtime", "start", "build/server.js" ]
