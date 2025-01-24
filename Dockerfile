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

# Copiar el resto del proyecto al contenedor
COPY . .

# construimos la app para producción
RUN ng build --configuration production

# Instalamos un servidor estático (serve)
RUN npm install -g serve

# Exponer el puerto que usará la aplicación
EXPOSE 80

# Comando para iniciar el servidor estático
CMD ["serve", "-s", "dist", "-l", "80"]
