#!/bin/bash

##########################################################
TOKEN=$(curl -s \
    --request POST \
    --header "Content-Type: application/json" \
    --data '{ "username": "mario@luigi.org", "password": "secure" }' \
    http://localhost:1221/auth/login)

echo
echo "Issued Token:"
echo $TOKEN
echo

##########################################################
echo "Validate token"

curl \
    --request POST \
    --header "Content-Type: application/json" \
    --data '{ "token": "'$TOKEN'" }' \
    http://localhost:1221/auth/token/validate

##########################################################
echo
echo
echo "Request User Infos..."

curl \
    --request GET \
    --header "Content-Type: application/json" \
    --header "Auth-Token: $TOKEN" \
    http://localhost:1221/user/info

##########################################################
echo
echo
echo "Renew the token in a while..."

sleep 3

curl \
    --request POST \
    --header "Content-Type: application/json" \
    --data '{ "token": "'$TOKEN'" }' \
    http://localhost:1221/auth/token/renew

##########################################################
echo
echo
echo "Finished."
echo
