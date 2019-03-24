#!/bin/bash

curl \
	--header "Content-Type: application/json" \
	--request POST \
	--data '{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTM0NTI0NTYsImV4cCI6MTU1MzQ1Mjc1Nn0.JanFD_uL9qAXCm4aotFz1__xbBX3F9tDKuWREIWMCAQ" }' \
	http://localhost:1221/auth/token/renew

