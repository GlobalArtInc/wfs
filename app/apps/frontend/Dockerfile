FROM node:alpine as build-stage
RUN apk update && apk add bash
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY ./ .
RUN yarn build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
