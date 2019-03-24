#!/bin/bash

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "username": "mario", "password": "invalid" }' \
	http://localhost:1221/auth/login

