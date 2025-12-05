# 🎾 SportifyClub

> Una app para reservar pistas deportivas. Simple, rápida y funcional.

![Estado](https://img.shields.io/badge/estado-funcionando-brightgreen)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)

---

## ¿Qué es esto?

SportifyClub es una plataforma web donde puedes:

- **Ver pistas deportivas** disponibles (pádel, tenis, fútbol, etc.)
- **Reservar** la que te guste para jugar
- **Gestionar** tus reservas si eres usuario
- **Administrar** tus pistas si tienes un club deportivo

Es como Booking, pero para pistas deportivas. Nada más, nada menos.

---

## ¿Cómo lo uso?

### Opción 1: Solo quiero verlo funcionar

1. Clona el repo:

   ```bash
   git clone https://github.com/GI-R0/SPORTS.git
   cd SPORTS
   ```

2. Instala todo (backend):

   ```bash
   cd backend
   npm install
   ```

3. Crea un archivo `.env` en la carpeta `backend`:

   ```env
   PORT=4000
   MONGODB_URI=tu_mongodb_uri
   JWT_SECRET=cualquier_texto_secreto
   FRONTEND_URL=http://localhost:5173
   ```

4. Arranca el backend:

   ```bash
   npm run dev
   ```

5. En otra terminal, instala el frontend:

   ```bash
   cd frontend/sportifyclub-frontend
   npm install
   ```

6. Arranca el frontend:

   ```bash
   npm run dev
   ```

7. Abre tu navegador en `http://localhost:5173`

¡Listo! Ya debería estar funcionando.

### Opción 2: Quiero datos de prueba

Si quieres poblar la base de datos con datos iniciales (usuarios, pistas y reservas de ejemplo):

1. Asegúrate de que MongoDB esté corriendo

2. Desde la carpeta `backend`, ejecuta:

   ```bash
   npm run seed
   ```

Esto cargará automáticamente:

- **30 usuarios** (5 clubs y 25 usuarios regulares)
- **30 pistas deportivas** (Pádel, Tenis, Fútbol 5)
- **100 reservas** relacionadas

Los datos se cargan desde archivos CSV ubicados en `backend/data/`:

- `usuarios.csv` - Usuarios y clubs
- `pistas.csv` - Pistas deportivas
- `reservas.csv` - Reservas de ejemplo

**Nota:** El seeding elimina todos los datos existentes antes de insertar los nuevos.

Para más detalles sobre el sistema de seeding, consulta `backend/src/seed/README.md`.

---

## ¿Qué tecnologías usa?

**Frontend:**

- React (para la interfaz)
- **Hooks Avanzados:**
  - `useContext` - Autenticación global
  - `useReducer` - Gestión compleja de reservas
  - Custom Hooks - Validaciones y lógica reutilizable
- Vite (para que cargue rápido)
- CSS vanilla (con variables para los colores del Barça 💙❤️)

**Backend:**

- Node.js + Express (el servidor)
- MongoDB (la base de datos)
- JWT (para el login)
- **Seeding desde CSV** - Población de datos con fs de Node.js

**Extras:**

- Cloudinary (para subir imágenes de las pistas)
- Axios (para conectar frontend con backend)
- csv-parser (para leer archivos CSV)

## Base de Datos y Modelos

SportifyClub utiliza **MongoDB** con **Mongoose** como ODM.

### Colecciones (3 en total)

1. **users** - Usuarios, clubs y administradores
2. **pistas** - Pistas deportivas
3. **reservas** - Reservas de pistas

**Características:**

- 3 colecciones relacionadas (cumple requisito de 2 + usuarios)
- Relaciones mediante ObjectId y ref
- Validaciones completas (enum, regex, rangos)
- Índices optimizados para búsquedas rápidas
- Middleware para encriptación de contraseñas
- Índice compuesto único para evitar reservas duplicadas

**Documentación completa:**

- `backend/MODELOS_BASE_DATOS.md` - Schemas detallados
- `backend/DIAGRAMA_RELACIONES.md` - Diagramas y queries

---

## Funcionalidades principales

### Para usuarios normales:

- Ver todas las pistas disponibles
- Buscar por nombre
- Filtrar por deporte
- Ver detalles de cada pista
- Hacer reservas
- Ver mis reservas
- Cancelar reservas

### Para dueños de clubes:

- Crear nuevas pistas
- Editar pistas existentes
- Eliminar pistas
- Ver estadísticas
- Gestionar reservas

### Para administradores:

- Todo lo anterior
- Gestionar usuarios
- Ver todas las pistas del sistema

---

## Diseño

- #004d98
- #a50044
- #edbb00

Porque si vas a hacer algo, que al menos se vea bonito 😎

---

## Seguridad

- Las contraseñas se guardan encriptadas (bcrypt)
- Usamos tokens JWT para el login
- Las rutas están protegidas según el rol del usuario
- CORS configurado para evitar accesos no autorizados

---

## ¿Problemas?

Si algo no funciona:

1. **El backend no arranca:**

   - Revisa que MongoDB esté corriendo
   - Verifica que el `.env` esté bien configurado

2. **El frontend no conecta con el backend:**

   - Asegúrate de que el backend esté en el puerto 4000
   - Revisa la configuración de CORS en `backend/src/app.js`

3. **No se ven las imágenes:**
   - Configura Cloudinary en el `.env`
   - O usa URLs de imágenes directas

---

## Variables de entorno necesarias

Crea un archivo `.env` en la carpeta `backend` con esto:

```env
# Puerto del servidor
PORT=4000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sportifyclub
# O usa MongoDB Atlas: mongodb+srv://usuario:password@cluster.mongodb.net/sportifyclub

# JWT
JWT_SECRET=pon_aqui_cualquier_texto_secreto_largo

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Cloudinary (opcional, para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## ¿Para qué sirve esto?

Este proyecto es ideal para:

- Aprender desarrollo Full Stack
- Ver cómo funciona una app MERN completa
- Entender autenticación con JWT
- Practicar React y Node.js
- Tener un portfolio decente

---

## ¿Quieres contribuir?

Si encuentras un bug o quieres añadir algo:

1. Haz un fork
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit (`git commit -m 'Añadí algo cool'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto es de código abierto. Úsalo como quieras, pero sería cool que me des crédito 😊

---

## Autor

Hecho con ☕ y 💙 por un desarrollador que ama el deporte

**¿Dudas?** Abre un issue en GitHub o mándame un mensaje.

**¿Te gustó?** Dale una ⭐ al repo, me ayuda un montón.

---

_Última actualización: Diciembre 2024_
