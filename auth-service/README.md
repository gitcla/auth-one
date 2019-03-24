## Setup

npm install to install all required tools.

## Compile

npm run tsc:watch to auto-compile the source .ts files in .src directory.

## Run the server

npm run serve to start the server (under the hood it runs ./dist/main.js using nodemon, which restarts the server each time the compiled files change).

# TODO

- Generate production quality build
- Implement renew token
- Implement invalidate for logout purposes
- Implement invalidate-all for security purposes
- Use PEM certificates
- Use a REDIS or Mongo Database to store users data
