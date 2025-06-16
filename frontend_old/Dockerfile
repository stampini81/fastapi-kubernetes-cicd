# frontend_old/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Declarar ARG para receber a variável de ambiente do build
ARG REACT_APP_API_BASE_URL
# Definir a variável de ambiente no contêiner para os comandos subsequentes
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN chmod +x ./node_modules/.bin/*

COPY public ./public
COPY src ./src

# npm run build usará a ENV REACT_APP_API_BASE_URL injetada
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]