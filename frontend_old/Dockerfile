# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Declarar ARG para receber a variável de ambiente do build (REACT_APP_API_BASE_URL)
ARG REACT_APP_API_BASE_URL
# Definir a variável de ambiente no contêiner durante o build, usando o valor do ARG
# É crucial que o React Scripts a veja durante 'npm run build'
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN chmod +x ./node_modules/.bin/* # Garante permissão de execução

COPY public ./public
COPY src ./src

# Construir a aplicação React para produção
# Este passo usará a ENV REACT_APP_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]