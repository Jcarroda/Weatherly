import axios from 'axios';
import * as Location from 'expo-location';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: getAuthHeaders(),
});

export interface WeatherData {
  ciudad: string;
  pais: string;
  region: string;
  temperatura: number;
  temperatura_f: number;
  descripcion: string;
  icono: string;
  humedad: number;
  velocidad_viento: number;
  presion: number;
  visibilidad: number;
  uv: number;
  hora_local: string;
  ultima_actualizacion: string;
}

export interface LocationWeatherData {
  ubicacion: {
    lat: number;
    lon: number;
    nombre: string;
    pais: string;
    region: string;
  };
  temperatura: number;
  temperatura_f: number;
  descripcion: string;
  icono: string;
  humedad: number;
  velocidad_viento: number;
  presion: number;
  visibilidad: number;
  uv: number;
  hora_local: string;
  ultima_actualizacion: string;
}

export interface ForecastData {
  ciudad: string;
  pais: string;
  region: string;
  hora_local: string;
  pronostico: Array<{
    fecha: string;
    temperatura_max: number;
    temperatura_min: number;
    descripcion: string;
    icono: string;
    probabilidad_lluvia: number;
    humedad: number;
    velocidad_viento: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Obtener clima por ciudad
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    console.log('🌍 Fetching weather for city:', city);
    console.log('🔗 API URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER_CITY}?city=${encodeURIComponent(city)}`);
    console.log('🔑 Headers:', getAuthHeaders());
    
    const response = await apiClient.get<ApiResponse<WeatherData>>(
      `${API_CONFIG.ENDPOINTS.WEATHER_CITY}?city=${encodeURIComponent(city)}`
    );
    
    console.log('✅ Response received:', response.data);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch weather data');
    }
  } catch (error: any) {
    console.error('❌ Error fetching weather:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 400) {
      throw new Error('City not found');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error');
    }
    throw new Error(error.message || 'Error getting weather data');
  }
};

// Obtener clima por ubicación (coordenadas)
export const getWeatherByLocation = async (lat: number, lon: number): Promise<LocationWeatherData> => {
  try {
    console.log('📍 Fetching weather for location:', { lat, lon });
    console.log('🔗 API URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER_LOCATION}?lat=${lat}&lon=${lon}`);
    console.log('🔑 Headers:', getAuthHeaders());
    
    const response = await apiClient.get<ApiResponse<LocationWeatherData>>(
      `${API_CONFIG.ENDPOINTS.WEATHER_LOCATION}?lat=${lat}&lon=${lon}`
    );
    
    console.log('✅ Response received:', response.data);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch weather data');
    }
  } catch (error: any) {
    console.error('❌ Error fetching weather by location:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid coordinates');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error');
    }
    throw new Error(error.message || 'Error getting weather data');
  }
};

// Obtener pronóstico del clima
export const getWeatherForecast = async (city: string, days: number = 3): Promise<ForecastData> => {
  try {
    const response = await apiClient.get<ApiResponse<ForecastData>>(
      `${API_CONFIG.ENDPOINTS.WEATHER_FORECAST}?city=${encodeURIComponent(city)}&days=${days}`
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch forecast data');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 400) {
      throw new Error('City not found');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error');
    }
    throw new Error(error.message || 'Error getting forecast');
  }
};

// Función para obtener la ubicación actual del usuario
export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
  try {
    console.log('📍 getCurrentLocation: Solicitando permisos de ubicación...');
    
    // Solicitar permisos de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('📍 getCurrentLocation: Status de permisos:', status);
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    
    console.log('📍 getCurrentLocation: Permisos concedidos, obteniendo ubicación...');
    
    // Obtener ubicación actual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    console.log('📍 getCurrentLocation: Ubicación obtenida:', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error: any) {
    console.error('❌ getCurrentLocation: Error:', error);
    
    if (error.message?.includes('denied')) {
      throw new Error('Location permission denied');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Timeout getting location');
    } else {
      throw new Error(`Error getting location: ${error.message}`);
    }
  }
};
