# Usamos la imagen oficial de Node.js v20
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia los archivos de configuración y dependencias al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps --verbose

# Mostrar los últimos 20 registros de la instalación (opcional para depuración)
RUN tail -n 20 /root/.npm/_logs/*.log

# Copiar el resto del proyecto al contenedor
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 4200

# Comando para iniciar el servidor
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
