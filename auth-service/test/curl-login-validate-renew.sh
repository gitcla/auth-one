#!/bin/bash

TOKEN=`curl -s \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "username": "mario@luigi.org", "password": "secure" }' \
	http://localhost:1221/auth/login`

echo
echo "Issued Token:"
echo $TOKEN
echo

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "token": "'$TOKEN'" }' \
	http://localhost:1221/auth/token/validate

echo
echo
echo "Renew the token in a while..."
echo

sleep 3

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "token": "'$TOKEN'" }' \
	http://localhost:1221/auth/token/renew

echo
echo
echo "Finished."
echo
