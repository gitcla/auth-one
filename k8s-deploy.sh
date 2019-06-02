#!/bin/bash

# Mongo
kubectl create configmap mongo-config --from-file=mongo/configs/mongodb.conf
kubectl create -f mongo/service.yaml
kubectl create -f mongo/deployment.yaml

# whoami-service
kubectl create -f whoami-service/k8s-service.yaml
kubectl create -f whoami-service/k8s-deployment.yaml

# ng-client
kubectl create -f ng-client/k8s-service.yaml
kubectl create -f ng-client/k8s-deployment.yaml

# reverse-proxy
kubectl create configmap reverse-proxy-config --from-file=reverse-proxy/nginx.conf
kubectl create -f reverse-proxy/k8s-service.yaml
kubectl create -f reverse-proxy/k8s-deployment.yaml
