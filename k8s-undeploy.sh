#!/bin/bash

# deployments and services
kubectl delete deployments,services -l app=auth-one

# config maps
kubectl delete configmap mongo-config
kubectl delete configmap reverse-proxy-config
