#!/bin/bash

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "username": "mario@luigi.org", "password": "secure" }' \
	http://localhost:1221/login

echo
echo
