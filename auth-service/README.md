## Setup

npm install to install all required tools.

## Compile

npm run tsc:watch to auto-compile the source .ts files in .src directory.

## Run the server

npm run serve to start the server (under the hood it runs ./dist/main.js using nodemon, which restarts the server each time the compiled files change).

## Environment variables

The following env variables with relative defaults are supported:

```
  TOKEN_EXPIRATION_TIME=5m
  MONGO_URL=mongodb://localhost:27017/authone
```

### TODO

- Generate production quality Dockerfile with:
  NODE_ENV=production
  npm install --production
- Prepare a script to load some users on a Mongo collection
- Configure indexes on collections
- Configure express for a production environment
- Review test scripts
- Configure rate limiter on login endpoint with:
  https://github.com/animir/node-rate-limiter-flexible  
  Check that the endpoint receives the caller IP (eventually from an header injected with nginx)
