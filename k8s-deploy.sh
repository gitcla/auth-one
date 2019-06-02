#!/bin/bash

# Mongo
kubectl create -f mongo/service.yaml
kubectl create -f mongo/deployment.yaml

# whoami-service
kubectl create -f whoami-service/k8s-service.yaml
kubectl create -f whoami-service/k8s-deployment.yaml

# Frontend
#kubectl create -f frontend/service.yaml
#kubectl create -f frontend/deployment.yaml
