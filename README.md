# Auth One: JWT token management on a Kubernetes Cluster

This is a proof of concept implementation of the OAuth protocol on a distributed microservice architecture deployed with Kubernetes.

JWT tokens are signed with an RSA private key so other microservices can verify the authenticity using the public key.  Tokens are configured to expire after a configurable period and can be refreshed with a specific call to the API.

It can be used as a proof of concept, not all the configurations are well suited for a production environment.

## Architecture

The system is composed of the following components:

- MongoDB as a storage
- authentication service: responsible to relase, refresh and revoke tokens.  Passwords are stored on MongoDB
- whoami service: a simple demo that uses the JWT token to display user informations
- home: an angular application that presents a login form and a simple home page. The application stores the JWT token on a cookie and is capable of refresh it when it's expired
- reverse proxy service: handle the http requests from outside and redirect them to the correspondig services

Every module is released as a Docker image and all the application can be deployed on Kubernetes using the configurations provided.
You can use minikube to test it under a laptop.

## Setup

First you must have a Kubernetes installation up and running (you can use [minikube](https://github.com/kubernetes/minikube) to test it on a laptop).

Start by initalizing the volume used by Mongo to store the data with the script ```k8s-init-volumes.sh```

Create the Mongo service and deployment with the following commands:

```bash
kubectl create configmap mongo-config --from-file=mongo/mongodb.conf
kubectl create -f mongo/k8s-service.yaml
kubectl create -f mongo/k8s-deployment.yaml
```

When the deployment is ready forward the TCP port:

```bash
MONGO_POD_NAME=$(kubectl get pods -l component=mongo -o custom-columns=:metadata.name --no-headers=true)
kubectl port-forward $MONGO_POD_NAME 27017:27017
```

Now you can point Robo 3T to localhost:27017 and create a new database called ```authone```.

Create a new collection called ```users``` with the following document:

```json
{
    "username": "mario@luigi.org",
    "password": "apNLRRRON1iRHvop7Wj7LUIPp71WhznNzaklH6lgmx4=",
    "fullName": "Mario Rossi"
}

```

The password associated for the user is **```secure```**.

Now you are ready to start all the other services, for semplicity you can launch the following scripts:

```bash
./k8s-undeploy.sh
./k8s-deploy.sh
```

### TODO

* [ ] Write a script to initialize Mongo database and populate users collection with sample data
* [ ] Add version endpoint to auth API
* [ ] Configure indexes on collections
* [ ] Filter calls to liveness and readiness endpoints on reverse-proxy
* [ ] Review nginx.conf
* [ ] Implement roles-service
* [ ] Implement users-service
