# Etapa 1: Construcción
FROM node:20-alpine as builder

# se establece el directorio de trabajo
WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar archivos necesarios
COPY package.json package-lock.json ./

# se limpia el caché de npm y luego instala las dependencias
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# se construye la aplicación para producción con SSR
RUN npm run build:ssr

# Etapa 2: Producción
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copiamos los archivos generados en la etapa de construcción
COPY --from=builder /ANGULAR_FRONTEND/dist/task-manager /app/dist/task-manager
COPY --from=builder /ANGULAR_FRONTEND/package.json /app/package.json

# se limpia el caché de npm y luego se instala solo las dependencias de producción
RUN npm cache clean --force && npm install --only=production --legacy-peer-deps

# se expone el puerto
EXPOSE 4000

# Comando para iniciar el servidor SSR
CMD ["npm", "run", "serve:ssr"]
