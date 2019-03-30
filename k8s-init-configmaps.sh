#!/bin/bash

kubectl create configmap mongo-config --from-file=mongo/configs/mongodb.conf
