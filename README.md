# Sistema de Restaurante en Tiempo Real

Este proyecto es un sistema de restaurante en tiempo real que implementa una arquitectura de microservicios. El sistema permite gestionar pedidos, cocina, almacén y proporciona actualizaciones en tiempo real a los clientes.

## 🏗️ Arquitectura

El sistema está compuesto por los siguientes microservicios:

- **Gateway**: Punto de entrada único para todas las peticiones HTTP y WebSocket
- **Order**: Gestiona los pedidos y su estado
- **Kitchen**: Maneja la preparación de los platos
- **Warehouse**: Administra el inventario de ingredientes
- **Market**: Simula la compra de ingredientes cuando el almacén está bajo

## 🛠️ Tecnologías Utilizadas

- TypeScript
- Node.js
- Docker
- RabbitMQ
- MongoDB
- WebSocket
- tsoa (Documentación API)

## 📋 Prerrequisitos

- Docker y Docker Compose
- Node.js (v18 o superior)
- npm o yarn

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd real-time-bar
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar los servicios con Docker Compose:
```bash
docker-compose up -d
```

## 🔧 Configuración

### Variables de Entorno

Cada microservicio requiere su propio archivo `.env`. Los archivos de ejemplo se encuentran en cada directorio del servicio:

- `gateway/.env.example`
- `order/.env.example`
- `kitchen/.env.example`
- `warehouse/.env.example`
- `market/.env.example`

Copia cada archivo `.env.example` a `.env` y configura las variables según tu entorno.

### Puertos por Defecto

- Gateway: 3000
- Order: 3001
- Kitchen: 3002
- Warehouse: 3003
- Market: 3004
- RabbitMQ: 5672
- MongoDB: 27017

## 📚 Documentación de la API

La documentación de la API está disponible en:

- Gateway: `http://localhost:3000/docs`
- Order: `http://localhost:3001/docs`
- Kitchen: `http://localhost:3002/docs`
- Warehouse: `http://localhost:3003/docs`
- Market: `http://localhost:3004/docs`

## 💻 Uso

### Iniciar el Sistema

1. Asegúrate de que todos los servicios estén corriendo:
```bash
docker-compose ps
```

2. Verifica los logs de los servicios:
```bash
docker-compose logs -f
```

### Flujo de Trabajo

1. Los clientes se conectan al Gateway a través de WebSocket
2. Realizan pedidos a través del endpoint `/orders`
3. La cocina recibe las notificaciones de nuevos pedidos
4. El almacén gestiona el inventario de ingredientes
5. El mercado se activa automáticamente cuando el almacén necesita más ingredientes

## 🧪 Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

## 📝 Notas Adicionales

- El sistema utiliza WebSocket para proporcionar actualizaciones en tiempo real
- Los pedidos tienen un tiempo de expiración de 5 minutos
- El almacén tiene un umbral mínimo de ingredientes que activa la compra automática
- La documentación de la API se genera automáticamente usando tsoa

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
