# # Usar uma imagem oficial do Node.js como base
# FROM node:18 AS build

# # Criar e definir o diretório de trabalho no contêiner
# WORKDIR /usr/src/app

# # Copiar os arquivos package.json e package-lock.json
# COPY package*.json ./

# # Instalar dependências
# RUN npm install

# # Copiar o restante do código da aplicação
# COPY . .

# # Construir a aplicação React
# RUN npm run build

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Usar uma imagem do servidor Nginx para servir os arquivos estáticos
# FROM nginx:alpine

# # Copiar os arquivos do build para o diretório do Nginx
# COPY --from=build /one-piece-ctf/app/build /usr/share/nginx/html

# # Expor a porta usada pelo Nginx
# EXPOSE 3000

# # Comando padrão do Nginx
# CMD ["nginx", "-g", "daemon off;"]
# Etapa de build
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Etapa nginx
FROM nginx:alpine

# Config do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do React
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]