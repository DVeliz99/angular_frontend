# Usa una imagen de Node.js como base
FROM node:18-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios del proyecto
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install -g npm@latest

# Muestra los últimos 20 registros de la instalación
RUN tail -n 20 /root/.npm/_logs/*.log

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación (incluye el cliente y el servidor para SSR)
RUN npm run build:ssr

# Configura una imagen final más ligera para la producción
FROM node:18-alpine

WORKDIR /app

# Copia solo los archivos necesarios desde la fase de build
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package-lock.json /app/

# Instala las dependencias de producción
RUN npm install --only=production

# Expone el puerto 4000 (o el puerto que tu servidor SSR usa)
EXPOSE 4000

# Comando para ejecutar el servidor SSR
CMD ["node", "dist/server/main.js"]
