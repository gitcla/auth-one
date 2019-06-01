#!/bin/bash

docker run -it --rm                       \
    -p 5000:5000                          \
    -v $PWD:/app -w /app                  \
    mcr.microsoft.com/dotnet/core/sdk:2.2 \
    dotnet watch run --urls=http://+:5000
