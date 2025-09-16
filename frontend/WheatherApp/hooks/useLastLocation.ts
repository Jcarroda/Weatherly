import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, LocationWeatherData, getCurrentLocation, getWeatherByLocation } from '@/services/weatherService';

export type WeatherDataType = WeatherData | LocationWeatherData | null;

const LAST_LOCATION_KEY = 'last_weather_location';
const LAST_WEATHER_DATA_KEY = 'last_weather_data';

export const useLastLocation = () => {
  const [lastLocation, setLastLocation] = useState<string>('');
  const [lastWeatherData, setLastWeatherData] = useState<WeatherDataType>(null);
  const [loading, setLoading] = useState(true);

  // Cargar la última ubicación al iniciar
  useEffect(() => {
    console.log('🔄 useLastLocation: useEffect ejecutándose...');
    loadLastLocation();
    // Intentar obtener la ubicación actual de manera silenciosa
    console.log('🔄 useLastLocation: Llamando a tryGetCurrentLocationSilently...');
    tryGetCurrentLocationSilently();
  }, []);

  // Cargar la última ubicación guardada
  const loadLastLocation = async () => {
    console.log('📂 loadLastLocation: Iniciando carga de ubicación guardada...');
    try {
      const savedLocation = await AsyncStorage.getItem(LAST_LOCATION_KEY);
      const savedWeatherData = await AsyncStorage.getItem(LAST_WEATHER_DATA_KEY);
      
      console.log('📂 loadLastLocation: Ubicación guardada:', savedLocation);
      console.log('📂 loadLastLocation: Datos del clima guardados:', savedWeatherData ? 'Sí' : 'No');
      
      if (savedLocation) {
        setLastLocation(savedLocation);
        console.log('📂 loadLastLocation: Ubicación establecida en estado');
      }
      
      if (savedWeatherData) {
        const parsedData = JSON.parse(savedWeatherData);
        setLastWeatherData(parsedData);
        console.log('📂 loadLastLocation: Datos del clima establecidos en estado');
      }
    } catch (error) {
      console.error('❌ loadLastLocation: Error:', error);
    } finally {
      setLoading(false);
      console.log('📂 loadLastLocation: Carga completada, loading establecido en false');
    }
  };

  // Guardar nueva ubicación y datos del clima
  const saveLocation = async (location: string, weatherData: WeatherDataType) => {
    try {
      await AsyncStorage.setItem(LAST_LOCATION_KEY, location);
      if (weatherData) {
        await AsyncStorage.setItem(LAST_WEATHER_DATA_KEY, JSON.stringify(weatherData));
      }
      
      setLastLocation(location);
      setLastWeatherData(weatherData);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Intentar obtener la ubicación actual automáticamente
  const tryGetCurrentLocation = async () => {
    try {
      console.log('📍 Intentando obtener ubicación automáticamente...');
      const position = await getCurrentLocation();
      console.log('📍 Ubicación obtenida:', position);
      
      // Obtener el clima de la ubicación actual
      const weatherData = await getWeatherByLocation(position.latitude, position.longitude);
      console.log('🌤️ Clima de ubicación actual obtenido:', weatherData);
      
      // Guardar la ubicación actual como última ubicación
      const locationName = weatherData.ubicacion.nombre;
      await saveLocation(locationName, weatherData);
      
      console.log('✅ Ubicación actual guardada automáticamente');
    } catch (error: any) {
      console.log('⚠️ No se pudo obtener ubicación automáticamente:', error.message);
      // Si falla la geolocalización, se mantienen los datos guardados anteriormente
    }
  };

  // Intentar obtener la ubicación actual de manera silenciosa (sin mostrar errores)
  const tryGetCurrentLocationSilently = async () => {
    console.log('📍 tryGetCurrentLocationSilently: Iniciando...');
    try {
      console.log('📍 tryGetCurrentLocationSilently: Llamando a getCurrentLocation...');
      const position = await getCurrentLocation();
      console.log('📍 tryGetCurrentLocationSilently: Ubicación obtenida:', position);
      
      console.log('🌤️ tryGetCurrentLocationSilently: Llamando a getWeatherByLocation...');
      const weatherData = await getWeatherByLocation(position.latitude, position.longitude);
      console.log('🌤️ tryGetCurrentLocationSilently: Clima obtenido:', weatherData);
      
      // Guardar la ubicación actual como última ubicación
      const locationName = weatherData.ubicacion.nombre;
      console.log('💾 tryGetCurrentLocationSilently: Guardando ubicación:', locationName);
      await saveLocation(locationName, weatherData);
      
      console.log('✅ tryGetCurrentLocationSilently: Ubicación guardada exitosamente');
    } catch (error: any) {
      // Solo log, sin mostrar errores al usuario
      console.error('❌ tryGetCurrentLocationSilently: Error completo:', error);
      console.log('📍 tryGetCurrentLocationSilently: No se pudo obtener ubicación silenciosamente:', error.message);
      // Si falla la geolocalización, se mantienen los datos guardados anteriormente
    }
  };

  // Limpiar datos guardados
  const clearLocation = async () => {
    try {
      await AsyncStorage.removeItem(LAST_LOCATION_KEY);
      await AsyncStorage.removeItem(LAST_WEATHER_DATA_KEY);
      
      setLastLocation('');
      setLastWeatherData(null);
    } catch (error) {
      console.error('Error clearing location:', error);
    }
  };

  return {
    lastLocation,
    lastWeatherData,
    loading,
    saveLocation,
    clearLocation,
    loadLastLocation,
    tryGetCurrentLocation,
    tryGetCurrentLocationSilently,
  };
};
