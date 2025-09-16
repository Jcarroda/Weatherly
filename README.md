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

## �� Para Desarrolladores

### Arquitectura del Proyecto
├── backend/ # API (Node.js + Fastify)
│ ├── src/
│ │ ├── routes/ # Rutas de la API
│ │ ├── services/ # Servicios de negocio
│ │ └── server.js # Servidor principal
│ └── package.json
├── frontend/
│ ├── WheatherApp/ # App móvil (Expo + React Native)
│ │ ├── app/ # Pantallas y navegación
│ │ ├── components/ # Componentes reutilizables
│ │ ├── hooks/ # Custom hooks
│ │ ├── services/ # Servicios de API
│ │ └── contexts/ # Context API
│ └── LandingWheather/ # Landing page web
└── README.md
### Tecnologías Utilizadas

#### Backend
- **Node.js** - Runtime de JavaScript
- **Fastify** - Framework web rápido
- **Axios** - Cliente HTTP
- **WeatherAPI.com** - API de datos meteorológicos

#### Frontend
- **Expo SDK 54** - Framework de desarrollo móvil
- **React Native** - Framework de UI móvil
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación basada en archivos
- **AsyncStorage** - Almacenamiento local
- **Expo Location** - Servicios de ubicación

### Instalación y Configuración

#### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- Cuenta en WeatherAPI.com

#### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd API-GATAWAY
```

#### 2. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env
echo "WEATHERAPI_KEY=tu_api_key_aqui" > .env

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

### API Endpoints

#### Clima Actual
```http
GET /weather/current?city={ciudad}
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
  }
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
  }
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

### Variables de Entorno

#### Backend (.env)
```env
WEATHERAPI_KEY=tu_api_key_de_weatherapi
PORT=3000
NODE_ENV=development
```

#### Frontend (app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

### Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---