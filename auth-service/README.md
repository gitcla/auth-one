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
- Implement invalidate for logout purposes
- Implement invalidate-all for security purposes
- Rename renew -> refresh
- Define correct error status codes
- Move user-info on a separate service
- Generate production quality Dockerfile with:
  NODE_ENV=production
  npm install --production
- Implement endpoints liveness and readiness for k8s health checks
- Prepare a script to load some users on a Mongo collection
- Configure indexes on collections
- Configure express for a production environment
- Review test scripts
- Configure rate limiter on login endpoint with:
  https://github.com/animir/node-rate-limiter-flexible  
  Check that the endpoint receives the caller IP (eventually from an header injected with nginx)
