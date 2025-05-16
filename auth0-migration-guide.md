# Guía de Migración a Auth0

Este documento explica cómo implementar Auth0 en tu aplicación NestJS existente manteniendo la compatibilidad con el sistema de autenticación actual.

## 1. Actualizar la Base de Datos

Primero, necesitas actualizar tu entidad User para incluir un campo `auth0Id`:

```sql
-- Ejecuta esta migración en tu base de datos
ALTER TABLE users ADD COLUMN auth0Id VARCHAR(100) NULL;
```

## 2. Configurar Auth0

1. Crea una cuenta en [Auth0](https://auth0.com/)
2. Configura una nueva aplicación:
   - Tipo: Regular Web Application
   - Allowed Callback URLs: `http://localhost:3000/api/auth0/callback` (ajusta según tu entorno)
   - Allowed Logout URLs: `http://localhost:3000` (ajusta según tu entorno)
   - Allowed Web Origins: `http://localhost:3000` (ajusta según tu entorno)

3. Crea una API en Auth0:
   - Identifier: `https://tu-api-identifier` (puedes elegir cualquier valor único)
   - Signing Algorithm: RS256

4. Configura los roles y permisos en Auth0:
   - Crea roles equivalentes a tus roles actuales (ADMIN, USER, etc.)
   - Asigna estos roles a los usuarios

## 3. Actualizar el archivo .env.development

Añade la siguiente configuración:

```
# Auth0 Configuration
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_AUDIENCE=https://tu-api-identifier
AUTH0_CALLBACK_URL=http://localhost:3000/api/auth0/callback
FRONTEND_URL=http://localhost:4200
```

## 4. Instalar Dependencias

```bash
npm install @nestjs/passport passport passport-jwt passport-auth0 jwks-rsa express-oauth2-jwt-bearer
```

## 5. Migrar desde AuthGuard a DualAuthGuard

En tus controladores, reemplaza gradualmente:

```typescript
@UseGuards(AuthGuard)
```

Por:

```typescript
@UseGuards(DualAuthGuard)
```

El `DualAuthGuard` acepta tanto tokens JWT locales como tokens de Auth0.

## 6. Actualizar el Frontend

En el frontend, necesitarás:

1. Implementar la autenticación con Auth0:
   - Utiliza la librería `@auth0/auth0-react` (React) o `@auth0/auth0-angular` (Angular)
   - Configura la redirección a `/api/auth0/login`

2. Gestionar el token de Auth0:
   - Después del login con Auth0, obtendrás un token que puedes usar en las llamadas a la API
   - Usa el endpoint `/api/auth0/token-exchange` para sincronizar el usuario de Auth0 con tu sistema

3. Mantener ambos flujos de autenticación:
   - Ruta tradicional: formulario de login → `/api/auth/login` → obtener token JWT
   - Ruta Auth0: botón "Login con Auth0" → redirección a Auth0 → callback → obtener token Auth0

## 7. Consideraciones para Producción

1. **Seguridad**:
   - Utiliza HTTPS en producción
   - Actualiza las URLs de callback y logout en la configuración de Auth0

2. **Migración de Usuarios**:
   - Considera importar usuarios existentes a Auth0 para una transición más fluida
   - Auth0 ofrece herramientas para la migración masiva de usuarios

3. **Roles y Permisos**:
   - Configura en Auth0 roles equivalentes a los de tu sistema
   - Puedes añadir estos roles como claims en el token JWT generado por Auth0

4. **Monitoreo**:
   - Añade logging para rastrear qué sistema de autenticación está utilizando cada usuario
