#!/bin/bash

# Mongo
kubectl create -f mongo/service.yaml
kubectl create -f mongo/deployment.yaml

# Backend
#kubectl create -f backend/service.yaml
#kubectl create -f backend/deployment.yaml

# Frontend
#kubectl create -f frontend/service.yaml
#kubectl create -f frontend/deployment.yaml
