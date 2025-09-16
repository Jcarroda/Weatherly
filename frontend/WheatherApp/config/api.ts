// Configuración de la API
export const API_CONFIG = {
  // URL base del backend hardcodeado
  BASE_URL: 'http://192.168.1.144:3000',

  // API Key hardcodeado
  API_KEY: 'clave_backend',

  // Timeout para las peticiones
  TIMEOUT: 10000,

  // Endpoints
  ENDPOINTS: {
    WEATHER_CITY: '/weather/city',
    WEATHER_LOCATION: '/weather/location',
    WEATHER_FORECAST: '/weather/forecast',
  },
};

// Logs de debug para verificar la configuración
console.log('🔧 API Config Debug:');
console.log('BASE_URL:', API_CONFIG.BASE_URL);
console.log('API_KEY:', API_CONFIG.API_KEY);

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener los headers de autenticación
export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.API_KEY,
});
