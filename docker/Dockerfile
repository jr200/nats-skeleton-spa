FROM node:18-alpine AS build

WORKDIR /app
COPY . /app
RUN npm install && npm run build

# minimal container
FROM nginx:stable-alpine-slim

RUN rm -f /etc/nginx/conf.d/* && \
    echo 'include /etc/nginx/conf.d/*.conf;' > /etc/nginx/nginx.conf

COPY ./docker/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html/

EXPOSE 80

ENTRYPOINT sh -c "\
    [ -f /vault/secrets/environment ] && source /vault/secrets/environment; \
    /usr/share/nginx/html/vite-envs.sh && \
    /docker-entrypoint.sh nginx -g 'daemon off;'"
