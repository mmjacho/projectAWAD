# Etapa 1: Construcción (Build)
FROM node:20-alpine as build
WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el código y construimos para producción
COPY . .
RUN npm run build --prod

# Etapa 2: Servidor (Nginx)
FROM nginx:alpine
# Copiamos el build de Angular a la carpeta pública de Nginx
# ¡OJO! Reemplaza 'nombre-de-tu-proyecto' con el nombre real que está en tu angular.json
COPY --from=build /app/dist/projectAWAD/browser /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]