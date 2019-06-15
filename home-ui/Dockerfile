# node is used to build the angular application
FROM node:10.16.0

WORKDIR /app
COPY . .

RUN npm ci --only=production
RUN npm run build

# We use nginx to serve the application
FROM nginx:1.15.2 AS runtime
WORKDIR /app
COPY --from=build /app/dist/home-ui /usr/share/nginx/html
