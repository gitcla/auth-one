FROM node:10.16.0

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json tsconfig.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm ci --only=production
RUN npm install typescript@2.9.2

# Bundle app source
COPY ./src/ ./src/

# Compile Typescript
RUN npm run tsc:build

EXPOSE 1221
CMD [ "npm", "start" ]
