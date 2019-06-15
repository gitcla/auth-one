#!/bin/bash

# mongo
kubectl create configmap mongo-config --from-file=mongo/mongodb.conf
kubectl create -f mongo/k8s-service.yaml
kubectl create -f mongo/k8s-deployment.yaml

# auth-service
kubectl create -f auth-service/k8s-service.yaml
kubectl create -f auth-service/k8s-deployment.yaml

# whoami-service
kubectl create -f whoami-service/k8s-service.yaml
kubectl create -f whoami-service/k8s-deployment.yaml

# home-ui
kubectl create -f home-ui/k8s-service.yaml
kubectl create -f home-ui/k8s-deployment.yaml

# reverse-proxy
kubectl create configmap reverse-proxy-config --from-file=reverse-proxy/nginx.conf
kubectl create -f reverse-proxy/k8s-service.yaml
kubectl create -f reverse-proxy/k8s-deployment.yaml
