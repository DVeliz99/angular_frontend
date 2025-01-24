# Usamos la imagen oficial de Node.js v20
FROM node:20-alpine as builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia los archivos de configuración y dependencias al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm ci

# Copiar el resto del proyecto al contenedor
COPY . .

# Construimos la app para producción con SSR
RUN npm run build:ssr

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiamos los archivos necesarios de la etapa de construcción
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

# Instalamos solo las dependencias de producción
RUN npm ci --only=production

# Exponer el puerto que usará la aplicación
EXPOSE 4000

# Comando para iniciar el servidor SSR
CMD ["node", "dist/task_manager/server/main.js"]