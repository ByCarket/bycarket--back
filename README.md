# 📌 ByCarKet

**ByCarKet** es el backend de una plataforma estilo marketplace orientada a la compraventa de autos. Permite a los usuarios registrarse, iniciar sesión, publicar vehículos en venta y gestionar su perfil dentro del sistema.  

Está desarrollado con **NestJS**, escrito en **TypeScript** y utiliza **PostgreSQL** como base de datos. La arquitectura sigue el estilo **REST** y está organizada en módulos independientes para cada dominio funcional.

---

## 🚀 Cómo levantar el proyecto  

### Requisitos previos:
- Node.js (versión 14 o superior)  
- PostgreSQL (o una base de datos configurada)  
- Un editor de código (Visual Studio Code recomendado)  
- Docker (opcional, si se usa para la base de datos)  

---

## Instalación:

### Clonar el repositorio:
```bash
git clone https://github.com/ByCarket/bycarket--back.git
cd bycarket--back
```

### Instalar las dependencias:
```bash
npm install
```

### Configurar el archivo `.env`:
- Renombrar el archivo `.env.example` a `.env`
- Configurar las variables de entorno para la conexión a la base de datos y otros servicios (como API keys si es necesario)

---

## Levantando el proyecto en modo desarrollo:
```bash
npm run start:dev
```

### Acceso a la aplicación:
El backend debería estar disponible en `http://localhost:3000`.  
Podés probar las rutas en esta URL.

---

## 🛠️ Tecnologías usadas
- **NestJS**: Framework de Node.js que utiliza TypeScript para crear aplicaciones escalables y mantenibles.
- **TypeScript**: Lenguaje de programación que ofrece tipado estático.
- **PostgreSQL**: Sistema de base de datos relacional.
- **TypeORM**: ORM que se integra con PostgreSQL.
- **Jest**: Framework de pruebas.
- **Swagger**: Generación de documentación interactiva.
- **Docker (opcional)**: Para entornos de desarrollo y producción.

---

## 🌳 Estructura de ramas / Git flow

Seguimos un flujo de trabajo basado en Git Flow simplificado:

- **main**: rama principal. Contiene el código en estado de producción estable.
- **dev**: rama de integración. Todas las ramas de desarrollo se mergean aquí. Cuando el código en `dev` se considera estable, se mergea a `main`.

Cada nueva tarea parte de `dev` y se desarrolla en una rama con el siguiente formato: `<tipo>/<nombre>`, donde `<nombre>` debe escribirse en **kebab-case** (minúsculas y separado por guiones).

### Tipos de ramas permitidos:

- `feature/<nombre>`: para el desarrollo de nuevas funcionalidades.
- `fix/<nombre>`: para la corrección de errores.
- `refactor/<nombre>`: para reestructuración del código sin alterar su comportamiento.
- `docs/<nombre>`: para agregar o modificar documentación (por ejemplo, README, Swagger, etc).
- `chore/<nombre>`: para tareas relacionadas con la configuración, mantenimiento, dependencias, scripts o mejoras internas que no afectan directamente la lógica de negocio (como actualizar ESLint, configurar Husky, o mejorar el entorno de desarrollo).
- `test/<nombre>`: para agregar, mejorar o refactorizar pruebas automatizadas (unitarias, de integración, e2e, etc.).

### Ejemplos de nombres de ramas:

- `feature/register-user`
- `fix/login-error`
- `refactor/user-service`
- `docs/update-readme`
- `chore/update-eslint-config`
- `test/add-auth-tests`

---

## 📐 Convención de commits

Usamos la convención **Conventional Commits** para mantener un historial claro y estructurado. El formato general es:
```ini
<tipo>(alcance opcional): descripción breve
```

### Tipos permitidos:
- **feat**: se usa cuando se agrega una nueva funcionalidad.
- **fix**: para corregir errores o bugs.
- **refactor**: para reestructuraciones internas del código que no afectan el comportamiento de la aplicación.
- **docs**: para agregar o modificar documentación (README, comentarios, Swagger, etc.).
- **test**: para agregar o modificar pruebas (unitarias, de integración, mocks, etc.).
- **chore**: para tareas menores de mantenimiento o configuración.

### Ejemplos:

- `feat(auth): agrega registro de usuarios`
- `fix(cars): corrige error al editar auto sin ID`
- `refactor(user): mejora la validación del email`
- `docs: actualiza el README con reglas de commits`
- `test(user): agrega pruebas unitarias para el servicio de usuarios`
- `chore(dev-env): actualiza configuración de ESLint y scripts de desarrollo`

---

# 📛 Convención de nombres

### Archivos y carpetas:  
- camelCase seguido del tipo o propósito  
  - `createUser.dto.ts`  
  - `users.controller.ts`  
  - `auth.service.ts`

### Clases:  
- PascalCase  
  - `UsersController`, `AuthService`

### Variables y funciones:  
- camelCase  
  - `getUserById`, `createCar`

### Interfaces:  
- prefijo `I` y PascalCase  
  - `IUser`, `ICar`

---

# 🧪 Pruebas

Utilizamos **Jest**.  

### Tipos de pruebas:
- **Pruebas unitarias**: servicios y funciones individuales.  
- **Pruebas de integración**: interacción entre módulos.

### Comando para ejecutar pruebas:
```bash
npm run test
```

### Comando para ejecutar pruebas end to end:
```bash
npm run test:e2e
```

### Convención de nombres de archivos de prueba:
- `*.spec.ts`  
  - Ej.: `user.service.spec.ts`, `auth.controller.spec.ts`

---

# 🧱 Manejo de errores

Utilizamos **exceptions** de NestJS para asegurar respuestas claras y consistentes.

### Tipos comunes:
- `BadRequestException`: errores de validación.  
- `UnauthorizedException`: errores de autenticación.  
- `NotFoundException`: recurso no encontrado.  
- `InternalServerErrorException`: errores inesperados.

### Ejemplo:
```ts
throw new NotFoundException('User not found');
```
### Formato de respuesta de error:
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## Endpoints

Esta es la lista de los endpoints disponibles en la API para el marketplace de autos.

### 🔐 Auth
**Autenticación y registro**
```bash
POST   /auth/register        → Crear usuario
POST   /auth/login           → Iniciar sesión
```

---

### 👤 Users
**Gestión de usuarios**
```bash
GET    /users/me             → Ver mi perfil
PUT    /users/me             → Actualizar mi perfil
DELETE /users/me             → Eliminar mi cuenta

GET    /users/:id            → Ver datos públicos de otro usuario

// Solo admin:
GET    /users                → Listar todos los usuarios
PUT    /users/:id/role       → Hacer admin a otro usuario
DELETE /users/:id            → Eliminar usuario
```

---

### 🚗 Posts
**Gestión de publicaciones de autos**
```bash
POST   /posts                     → Crear nueva publicación (incluye datos del auto)
GET    /posts                     → Ver todas las publicaciones (con filtros por query)
GET    /posts/:id                 → Ver publicación por ID
GET    /posts/users/:id           → Ver publicaciones de un usuario

PUT    /posts/:id                 → Editar una publicación
PUT    /posts/:id/status          → Cambiar estado de la publicación (active, sold, inactive)
DELETE /posts/:id                 → Eliminar o desactivar una publicación

// Solo admin:
GET    /posts/pending             → Ver publicaciones pendientes de aprobación
PATCH  /posts/:id/approve         → Aprobar publicación
PATCH  /posts/:id/reject          → Rechazar publicación
```

---

### 🚗 Vehicles
**Gestión de publicaciones de autos**
```bash
PATCH  /vehicles/:id                 → Actualizar un vehiculo
DELETE /vehicles/:id                 → Eliminar un vehiculo
```

---