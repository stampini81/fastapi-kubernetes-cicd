FROM node:18-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN chmod +x ./node_modules/.bin/* # Garante permissão de execução

COPY public ./public
COPY src ./src

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]