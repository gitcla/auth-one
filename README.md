# Auth0 with token renewal

This is a proof of concept implementation of Auth0 in a distributed cluster environment with Docker and Kubernetes.

# Mongo

For debugging purposes you can connect to MongoDB with the following command:

```
MONGO_POD_NAME=$(kubectl get pods -l component=mongo -o custom-columns=:metadata.name --no-headers=true)
kubectl port-forward $MONGO_POD_NAME 27017:27017
```

Now point Robo 3T to localhost:27017

## TODO

- Use liveness to check container state
- Filter calls to liveness and readiness endpoints
- Write a script to initialize Mongo database and populate users collection
- Review nginx.conf for reverse proxy

