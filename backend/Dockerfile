# Etapa 1: construir frontend
FROM node:20 AS node_builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: PHP con Laravel
FROM php:8.2-cli

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar proyecto
COPY . .

# Copiar build del frontend
COPY --from=node_builder /app/public/build ./public/build

# Instalar dependencias de Laravel (solo producción)
RUN composer install --no-dev --optimize-autoloader

# Optimizar configuración, rutas, vistas y eventos
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Permisos
RUN chmod -R 777 storage bootstrap/cache

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
