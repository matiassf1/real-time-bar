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

2. Instalar dependencias en los microservicios:
```bash
npm install
```

3. Iniciar los servicios con Docker Compose:
```bash
docker-compose up -d
```

## 🔧 Configuración

### Puertos por Defecto

- Gateway: 3000
- Order: 3001
- Kitchen: 3002
- Warehouse: 3003
- Market: 3004
- RabbitMQ: 5672
- MongoDB: 27017

### Inicialización de la Base de Datos

El sistema viene con datos de ejemplo predefinidos que incluyen ingredientes y recetas. Para inicializar la base de datos con estos datos, ejecuta el siguiente script SQL:

```sql
-- Primero, insertar ingredientes comunes
INSERT INTO ingredients (name) VALUES
    ('Salt'),
    ('Black Pepper'),
    ('Olive Oil'),
    ('Garlic'),
    ('Onion'),
    ('Tomato'),
    ('Chicken Breast'),
    ('Rice'),
    ('Pasta'),
    ('Parmesan Cheese');

-- Luego, insertar algunas recetas
INSERT INTO recipes (name) VALUES
    ('Simple Pasta with Tomato Sauce'),
    ('Chicken Rice Bowl'),
    ('Garlic Butter Chicken');

-- Finalmente, insertar las relaciones receta-ingrediente con cantidades
INSERT INTO recipes_ingredients ("recipeId", "ingredientId", quantity) VALUES
    -- Pasta with Tomato Sauce
    (1, 9, 500),    -- 500g of Pasta
    (1, 6, 4),      -- 4 Tomatoes
    (1, 5, 1),      -- 1 Onion
    (1, 4, 2),      -- 2 Garlic cloves
    (1, 3, 60),     -- 60ml Olive Oil
    (1, 1, 10),     -- 10g Salt
    (1, 2, 5),      -- 5g Black Pepper
    (1, 10, 50),    -- 50g Parmesan Cheese

    -- Chicken Rice Bowl
    (2, 7, 300),    -- 300g Chicken Breast
    (2, 8, 200),    -- 200g Rice
    (2, 3, 30),     -- 30ml Olive Oil
    (2, 4, 2),      -- 2 Garlic cloves
    (2, 1, 8),      -- 8g Salt
    (2, 2, 3),      -- 3g Black Pepper

    -- Garlic Butter Chicken
    (3, 7, 400),    -- 400g Chicken Breast
    (3, 4, 4),      -- 4 Garlic cloves
    (3, 3, 40),     -- 40ml Olive Oil
    (3, 1, 8),      -- 8g Salt
    (3, 2, 4);      -- 4g Black Pepper
```

Estos datos de ejemplo incluyen:
- 10 ingredientes comunes
- 3 recetas populares
- Relaciones detalladas entre recetas e ingredientes con cantidades específicas

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

