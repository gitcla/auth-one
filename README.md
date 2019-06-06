# Auth0 with token renewal

This is a proof of concept implementation of OAuth on a distributed microservice architecture deployed with Kubernetes.

# Mongo

For debugging purposes you can connect to MongoDB with the following command:

```
MONGO_POD_NAME=$(kubectl get pods -l component=mongo -o custom-columns=:metadata.name --no-headers=true)
kubectl port-forward $MONGO_POD_NAME 27017:27017
```

Now point Robo 3T to localhost:27017

The users collection should contain documents like this:

```
  {
      username: 'mario@luigi.org',
      password: 'apNLRRRON1iRHvop7Wj7LUIPp71WhznNzaklH6lgmx4=',
      fullName: 'Mario Rossi'
  }

Password is: 'secure'
```

## TODO

- Use liveness to check container state
- Filter calls to liveness and readiness endpoints on reverse-proxy
- Update apiVersion declarations on yaml files
- Write a script to initialize Mongo database and populate users collection with sample data
- Configure indexes on collections
- Review nginx.conf for reverse proxy
- Implement roles-service
- Implement users-service

