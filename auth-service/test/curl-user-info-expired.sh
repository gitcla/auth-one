#!/bin/bash

TOKEN='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTM0NjM0MDgsImV4cCI6MTU1MzQ2MzcwOH0.Wuatj-WM5CgzaSrDqFxxYATv365HgunzJgc0ww1KJVROiaSTCOomd-RNJ9F_bLNfZfEajO_FFfWJ6lnDGzYjmQ164YZEd5leknxmioKC9P-3n74jlqJJawpeq9lVu0oBg7_-J8kGYLkKKQH_UNnraZUxRbyLYkXI8Vv5GfBVzjPvkh6wwx4vKgWYwJGzTwwDF__xrpcFoKBdwWxaO62DCyTuFqJn73dppQUO-AnKp7oD5rIodRRr3d-AHtB45SYqrg4foKNOe6QzitetMHz-uzPULii6DKCB8i1XfphQyeaWRxJVwZxwxb-bBpgD9bbuXmQ-VxAC4srgjcQNRNw_HQ'

curl -i \
    --request GET \
    --header "Content-Type: application/json" \
    --header "Auth-Token: $TOKEN" \
    http://localhost:1221/user/info

echo
echo
