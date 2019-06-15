# node is used to build the angular application
FROM node:10.16.0 AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

# We use nginx to serve the application
FROM nginx:1.16.0 AS runtime
WORKDIR /app
COPY --from=build /app/dist/home-ui /usr/share/nginx/html
