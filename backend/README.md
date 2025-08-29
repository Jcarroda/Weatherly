# 🌤️ Weather API Gateway

API Gateway para servicios meteorológicos utilizando [WeatherAPI.com](https://www.weatherapi.com/) como proveedor de datos.

## 🚀 Características

- **Clima en tiempo real** por ciudad y coordenadas
- **Pronósticos meteorológicos** hasta 14 días
- **Validación de parámetros** robusta
- **Manejo de errores** detallado
- **Logging** completo con Fastify
- **Middleware de autenticación** configurable

## 🛠️ Tecnologías

- **Fastify** - Framework web rápido y eficiente
- **Axios** - Cliente HTTP para requests
- **Dotenv** - Variables de entorno
- **Nodemon** - Reinicio automático en desarrollo

## 📋 Requisitos

- Node.js 18+
- API Key de [WeatherAPI.com](https://www.weatherapi.com/)
- Puerto 3000 disponible (configurable)

## ⚙️ Instalación

```bash
# Clonar repositorio
git clone <tu-repo>
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp config.env.example .env
# Editar .env con tu API key

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🔑 Variables de Entorno

```env
WEATHERAPI_KEY=tu_api_key_aqui
PORT=3000
```

## 📡 Rutas Disponibles

### 🏠 **Rutas del Sistema**

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| `GET` | `/` | Información del API | Info del servidor |
| `GET` | `/health` | Estado del servidor | Status de salud |

### 🌤️ **Rutas Meteorológicas**

#### **Clima Actual por Ciudad**
```http
GET /weather/city?city=Madrid
```

**Parámetros:**
- `city` (requerido): Nombre de la ciudad

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ciudad": "Madrid",
    "pais": "Spain",
    "region": "Madrid",
    "temperatura": 22,
    "temperatura_f": 71.6,
    "descripcion": "Partly cloudy",
    "icono": "//cdn.weatherapi.com/weather/64x64/day/116.png",
    "humedad": 65,
    "velocidad_viento": 15,
    "presion": 1015,
    "visibilidad": 10,
    "uv": 5,
    "hora_local": "2024-01-15 14:30",
    "ultima_actualizacion": "2024-01-15 14:15"
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

#### **Clima Actual por Coordenadas**
```http
GET /weather/location?lat=40.4168&lon=-3.7038
```

**Parámetros:**
- `lat` (requerido): Latitud (-90 a 90)
- `lon` (requerido): Longitud (-180 a 180)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ubicacion": {
      "lat": 40.4168,
      "lon": -3.7038,
      "nombre": "Madrid",
      "pais": "Spain",
      "region": "Madrid"
    },
    "temperatura": 22,
    "temperatura_f": 71.6,
    "descripcion": "Partly cloudy",
    "icono": "//cdn.weatherapi.com/weather/64x64/day/116.png",
    "humedad": 65,
    "velocidad_viento": 15,
    "presion": 1015,
    "visibilidad": 10,
    "uv": 5,
    "hora_local": "2024-01-15 14:30",
    "ultima_actualizacion": "2024-01-15 14:15"
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

#### **Pronóstico Meteorológico**
```http
GET /weather/forecast?city=Madrid&days=5
```

**Parámetros:**
- `city` (requerido): Nombre de la ciudad
- `days` (opcional): Número de días (1-14, default: 3)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ciudad": "Madrid",
    "pais": "Spain",
    "region": "Madrid",
    "hora_local": "2024-01-15 14:30",
    "pronostico": [
      {
        "fecha": "2024-01-15",
        "temperatura_max": 25,
        "temperatura_min": 15,
        "descripcion": "Sunny",
        "icono": "//cdn.weatherapi.com/weather/64x64/day/113.png",
        "probabilidad_lluvia": 10,
        "humedad": 60,
        "velocidad_viento": 12
      }
    ]
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## 🚧 Rutas Futuras (Por Implementar)

### ⏰ **Pronóstico por Hora**
```http
GET /weather/hourly?city=Madrid&days=3
GET /weather/hourly?city=Madrid&hour=12
```

### 🌬️ **Calidad del Aire**
```http
GET /weather/air-quality?city=Madrid
GET /weather/air-quality?lat=40.4168&lon=-3.7038
```

### 🌸 **Datos de Polen**
```http
GET /weather/pollen?city=Madrid
GET /weather/pollen?lat=40.4168&lon=-3.7038
```

### 🌊 **Clima Marítimo**
```http
GET /weather/marine?city=Valencia
GET /weather/marine?lat=39.4699&lon=-0.3763
```

### 🌙 **Astronomía**
```http
GET /weather/astronomy?city=Madrid&date=2024-01-15
GET /weather/astronomy?city=Madrid&date=today
```

### 📚 **Clima Histórico**
```http
GET /weather/history?city=Madrid&date=2024-01-15
GET /weather/history?city=Madrid&date=2023-12-25
```

### 🚨 **Alertas Meteorológicas**
```http
GET /weather/alerts?city=Madrid
GET /weather/alerts?lat=40.4168&lon=-3.7038
```

### 🌱 **Evapotranspiración**
```http
GET /weather/evapotranspiration?city=Madrid
GET /weather/evapotranspiration?lat=40.4168&lon=-3.7038
```

### ⚽ **Datos Deportivos**
```http
GET /weather/sports?city=Madrid
GET /weather/sports?lat=40.4168&lon=-3.7038
```

### 🕐 **Zona Horaria**
```http
GET /weather/timezone?city=Madrid
GET /weather/timezone?lat=40.4168&lon=-3.7038
```

### 🔍 **Autocompletado**
```http
GET /weather/search?query=Mad
GET /weather/search?query=New York
```

### 📍 **Geocodificación**
```http
GET /weather/geocode?city=Madrid
GET /weather/geocode?lat=40.4168&lon=-3.7038
```

### 📊 **Datos Bulk (Múltiples Ciudades)**
```http
GET /weather/bulk?cities=Madrid,Barcelona,Valencia
GET /weather/bulk?cities=London,Paris,Berlin
```

### 🌐 **Basado en IP**
```http
GET /weather/ip
GET /weather/ip?ip=8.8.8.8
```

### 📱 **Optimizado para Móvil**
```http
GET /weather/mobile?city=Madrid
GET /weather/mobile?lat=40.4168&lon=-3.7038
```

## 🔧 Parámetros Globales

Todas las rutas meteorológicas soportan estos parámetros opcionales:

| Parámetro | Descripción | Valores | Default |
|-----------|-------------|---------|---------|
| `lang` | Idioma de respuesta | `es`, `en`, `fr`, `de`, etc. | `en` |
| `aqi` | Incluir calidad del aire | `yes`, `no` | `no` |
| `alerts` | Incluir alertas | `yes`, `no` | `no` |
| `tides` | Incluir mareas (marine) | `yes`, `no` | `no` |

## 📝 Ejemplos de Uso

### Clima completo con calidad del aire
```bash
curl "http://localhost:3000/weather/city?city=Madrid&aqi=yes&lang=es"
```

### Pronóstico extendido con alertas
```bash
curl "http://localhost:3000/weather/forecast?city=Barcelona&days=7&alerts=yes&lang=ca"
```

### Clima por coordenadas
```bash
curl "http://localhost:3000/weather/location?lat=40.4168&lon=-3.7038&aqi=yes"
```

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| `400` | Parámetros inválidos o faltantes |
| `401` | API key inválida |
| `404` | Ciudad o ubicación no encontrada |
| `500` | Error interno del servidor |

## 🧪 Testing

```bash
# Verificar estado del servidor
curl http://localhost:3000/health

# Obtener información del API
curl http://localhost:3000/

# Probar clima por ciudad
curl "http://localhost:3000/weather/city?city=Madrid"
```

## 📚 Documentación Adicional

- [WeatherAPI.com Documentation](https://www.weatherapi.com/docs/)
- [Fastify Documentation](https://www.fastify.io/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de [WeatherAPI.com](https://www.weatherapi.com/docs/)

---

**Desarrollado con ❤️ usando [WeatherAPI.com](https://www.weatherapi.com/)**
