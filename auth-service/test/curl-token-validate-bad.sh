#!/bin/bash

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "token": "invalid_token" }' \
	http://localhost:1221/token/validate

