# 🌤️ Weatherly - Weather Application

Un sistema completo API con una aplicación móvil de clima desarrollada con Expo/React Native y backend en Node.js.

## 📱 Para Usuarios

### ¿Qué es este proyecto?

**Weatherly** es una aplicación móvil que te permite:

- �� **Buscar el clima** de cualquier ciudad del mundo
- 📅 **Ver pronósticos** de hasta 14 días
- ❤️ **Guardar ubicaciones favoritas** para acceso rápido
- 🔄 **Navegación fluida** entre pantallas con swipe
- 📍 **Ubicación automática** usando GPS

### Características Principales

- **🏠 Home**: Pantalla principal con clima actual y búsqueda
- **📊 Forecast**: Pronóstico extendido de 14 días con detalles completos
- **⭐ Favorites**: Gestión de ubicaciones favoritas
- **🌐 Búsqueda Global**: Busca en una pantalla y actualiza todas las demás

### Cómo Usar la App

1. **Buscar Ciudad**: Escribe el nombre de una ciudad en la barra de búsqueda
2. **Ver Pronóstico**: Desliza a la pestaña "Forecast" para ver el pronóstico extendido
3. **Guardar Favoritos**: Ve a "Favorites" y agrega tus ciudades preferidas
4. **Navegación**: Desliza horizontalmente entre pestañas o toca los iconos

---

## 🚀 Despliegue en Producción

### Estado Actual del Proyecto

- ✅ **Backend desplegado**: https://weatherly-backend-nrh7.onrender.com/
- ✅ **App móvil**: APK generado y funcionando
- 🔄 **Landing page**: Desplegada en Vercel

### Arquitectura de Despliegue

```bash
📦 Producción
├── �� Backend (Render)
│   ├── URL: https://weatherly-backend-nrh7.onrender.com/
│   ├── API REST con Fastify
│   └── Integración con WeatherAPI.com
│
├── 📱 App Móvil (APK)
│   ├── Generada con EAS Build
│   ├── Conectada al backend en producción
│   └── Disponible para Android
│
└── ��️ Landing Page (Vercel)
    ├── Página informativa
    └── Enlaces de descarga
```

### Tecnologías de Despliegue

- **Backend**: Render.com (Node.js hosting)
- **App Móvil**: EAS Build (Expo Application Services)
- **Landing**: Vercel (Static site hosting)
- **API Externa**: WeatherAPI.com

---

### Arquitectura del Proyecto

```bash
📦 Project
├── 📡 backend/               # API (Node.js + Fastify)
│   ├── 📂 src/
│   │   ├── 🛣️ routes/        # Rutas de la API
│   │   ├── ⚙️ services/      # Servicios de negocio
│   │   └── �� server.js      # Servidor principal
│   ├── 📜 package.json
│   └── �� .env              # Variables de entorno
│
├── �� frontend/
│   ├── 📱 WheatherApp/        # App móvil (Expo + React Native)
│   │   ├── 📂 app/           # Pantallas y navegación
│   │   ├── 🧩 components/    # Componentes reutilizables
│   │   ├── 🪝 hooks/         # Custom hooks
│   │   ├── 🔌 services/      # Servicios de API
│   │   ├── �� contexts/      # Context API
│   │   ├── ⚙️ config/        # Configuración de API
│   │   └── 📱 eas.json       # Configuración EAS Build
│
│   └── 🖥️ LandingWheather/   # Landing page web
│
├── 🚀 render.yaml            # Configuración de despliegue
└── �� README.md
```

### Tecnologías Utilizadas

#### Backend
- **Node.js** - Runtime de JavaScript
- **Fastify** - Framework web rápido
- **Axios** - Cliente HTTP
- **WeatherAPI.com** - API de datos meteorológicos
- **CORS** - Configurado para app móvil

#### Frontend
- **Expo SDK 54** - Framework de desarrollo móvil
- **React Native** - Framework de UI móvil
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación basada en archivos
- **AsyncStorage** - Almacenamiento local
- **Expo Location** - Servicios de ubicación
- **EAS Build** - Generación de APK

### Instalación y Configuración

#### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- EAS CLI
- Cuenta en WeatherAPI.com
- Cuenta en Render.com
- Cuenta en Vercel

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/Jcarroda/Weatherly.git
cd Weatherly
```

#### 2. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env
echo "API_KEY_SECRETA=clave_backend" > .env
echo "PORT=3000" >> .env
echo "WEATHERAPI_KEY=tu_api_key_aqui" >> .env
echo "NODE_ENV=production" >> .env

# Iniciar servidor
npm start
```

#### 3. Configurar Frontend
```bash
cd frontend/WheatherApp
npm install

# Iniciar aplicación
npx expo start
```

### Despliegue Paso a Paso

#### 1. Desplegar Backend en Render

1. **Crear archivo render.yaml** en la raíz:
```yaml
services:
  - type: web
    name: weatherly-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    rootDir: backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: API_KEY_SECRETA
        value: clave_backend
      - key: WEATHERAPI_KEY
        sync: false
```

2. **Hacer commit y push**:
```bash
git add .
git commit -m "Configure backend for deployment"
git push origin production
```

3. **En Render Dashboard**:
   - Crear nuevo Blueprint
   - Conectar repositorio GitHub
   - Seleccionar rama `production`
   - Configurar variable `WEATHERAPI_KEY`

#### 2. Generar APK con EAS Build

1. **Instalar EAS CLI**:
```bash
npm install -g eas-cli
```

2. **Configurar EAS**:
```bash
cd frontend/WheatherApp
npx eas-cli login
npx eas-cli build:configure
```

3. **Crear eas.json**:
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

4. **Generar APK**:
```bash
npx eas-cli build --platform android --profile preview
```

#### 3. Desplegar Landing en Vercel

1. **Subir carpeta LandingWheather** a Vercel
2. **Configurar dominio** personalizado (opcional)
3. **Agregar enlaces** de descarga del APK

### API Endpoints

#### Backend en Producción
- **Base URL**: https://weatherly-backend-nrh7.onrender.com/
- **Health Check**: https://weatherly-backend-nrh7.onrender.com/health
- **API Info**: https://weatherly-backend-nrh7.onrender.com/

#### Clima Actual
```http
GET /weather/city?city={ciudad}
GET /weather/location?lat={latitud}&lon={longitud}
```

#### Pronóstico
```http
GET /weather/forecast?city={ciudad}&days={dias}
```

### Estructura de Datos

#### Respuesta de Clima Actual
```json
{
  "success": true,
  "data": {
    "ciudad": "Madrid",
    "pais": "Spain",
    "region": "Madrid",
    "temperatura": 22,
    "descripcion": "Partly cloudy",
    "humedad": 65,
    "velocidad_viento": 15,
    "hora_local": "2024-01-15 14:30"
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

#### Respuesta de Pronóstico
```json
{
  "success": true,
  "data": {
    "ciudad": "Madrid",
    "pronostico": [
      {
        "fecha": "2024-01-15",
        "temperatura_max": 25,
        "temperatura_min": 15,
        "descripcion": "Sunny",
        "probabilidad_lluvia": 10,
        "humedad": 60,
        "velocidad_viento": 12
      }
    ]
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

### Funcionalidades Técnicas

#### Búsqueda Global
- **Context API** para estado global
- **Sincronización** entre todas las pantallas
- **Persistencia** de última ubicación

#### Gestión de Favoritos
- **AsyncStorage** para persistencia local
- **CRUD completo** de ubicaciones
- **Integración** con búsqueda global

#### Navegación
- **Expo Router** con tabs
- **Swipe navigation** entre pantallas
- **Deep linking** support

#### Autenticación
- **API Key** en headers (`x-api-key`)
- **CORS** configurado para app móvil
- **Rate limiting** implementado

### Scripts Disponibles

#### Backend
```bash
npm start          # Iniciar servidor de desarrollo
npm run dev        # Modo desarrollo con hot reload
npm test           # Ejecutar tests
```

#### Frontend
```bash
npx expo start     # Iniciar Expo development server
npx expo start --web    # Iniciar en web
npx expo start --android # Iniciar en Android
npx expo start --ios     # Iniciar en iOS
```

#### EAS Build
```bash
npx eas-cli build --platform android --profile preview  # Generar APK
npx eas-cli build --platform android --profile production  # Generar AAB para Play Store
```

### Variables de Entorno

#### Backend (.env)
```env
API_KEY_SECRETA=clave_backend
PORT=3000
WEATHERAPI_KEY=tu_api_key_de_weatherapi
NODE_ENV=production
```

#### Frontend (config/api.ts)
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://weatherly-backend-nrh7.onrender.com',
  API_KEY: 'clave_backend',
  TIMEOUT: 10000,
};
```

### URLs de Producción

- **Backend API**: https://weatherly-backend-nrh7.onrender.com/
- **Landing Page**: [URL de Vercel]
- **APK Download**: [Enlace de EAS Build]

### Troubleshooting

#### Problemas Comunes

1. **App móvil no se conecta al backend**:
   - Verificar configuración CORS
   - Comprobar URL en config/api.ts
   - Verificar API key en headers

2. **Error 401 Unauthorized**:
   - Verificar que API_KEY_SECRETA coincida
   - Comprobar header x-api-key

3. **Error de WeatherAPI**:
   - Verificar WEATHERAPI_KEY en Render
   - Comprobar límites de la API

### Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## �� Contacto

- **Desarrollador**: Javier Carro
- **GitHub**: [Jcarroda](https://github.com/Jcarroda)
- **Proyecto**: [Weatherly](https://github.com/Jcarroda/Weatherly)