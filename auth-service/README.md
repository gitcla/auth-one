## Setup

npm install to install all required tools.

## Compile

npm run tsc:watch to auto-compile the source .ts files in .src directory.

## Run the server

npm run serve to start the server (under the hood it runs ./dist/main.js using nodemon, which restarts the server each time the compiled files change).

# TODO

- Use a REDIS or Mongo Database to store users data and issued tokens
- Configure express for a production environment
- Implement invalidate for logout purposes
- Implement invalidate-all for security purposes
- Remove validate endpoint (this does not make sense in a standard use case)
- Define correct error status codes
- Move user-info on a separate service
- Rename renew -> refresh
- Generate production quality build
