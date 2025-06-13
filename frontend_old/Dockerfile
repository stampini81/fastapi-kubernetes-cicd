# frontend_old/Dockerfile
# Use uma imagem base Node.js para construir a aplicação React
FROM node:18-alpine AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências
COPY package.json ./
COPY package-lock.json ./

# Instalar dependências
RUN npm install

# Adicionar permissão de execução aos scripts binários
RUN chmod +x ./node_modules/.bin/* # Adicionando permissão de execução

# Copiar a pasta public/ e src/ explicitamente
COPY public ./public
COPY src ./src

# Construir a aplicação React para produção
RUN npm run build

# Use uma imagem base mais leve para servir os arquivos estáticos
FROM nginx:alpine

# Copiar os arquivos de build da fase anterior para o diretório de serviço do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
