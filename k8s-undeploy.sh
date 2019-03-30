#!/bin/bash

kubectl delete deployments,services -l app=auth-one
