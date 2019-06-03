## Setup

npm install to install all required tools.

## Compile

npm run tsc:watch to auto-compile the source .ts files in .src directory.

## Run the server

npm run serve to start the server (under the hood it runs ./dist/main.js using nodemon, which restarts the server each time the compiled files change).

## Environment variables

The following env variables with relative defaults are supported:

```
  EXPIRATION_TIME=5m
  MONGO_URL=mongodb://localhost:27017/authone
```

### TODO

- Use a Mongo Database to store users data and issued tokens
- Configure express for a production environment
- Implement invalidate for logout purposes
- Implement invalidate-all for security purposes
- Define correct error status codes
- Move user-info on a separate service
- Rename renew -> refresh
- Generate production quality build
- Prepare a script to load some users on a Mongo collection
