import { useState, useCallback, useEffect } from 'react';
import { 
  getWeatherByCity, 
  getWeatherByLocation, 
  getCurrentLocation,
  type WeatherData,
  type LocationWeatherData 
} from '@/services/weatherService';
import { useLastLocation } from './useLastLocation';
import { useGlobalSearch } from './useGlobalSearch';

export type WeatherDataType = WeatherData | LocationWeatherData | null;

export interface UseWeatherReturn {
  weatherData: WeatherDataType;
  loading: boolean;
  error: string | null;
  searchType: 'city' | 'location' | null;
  getWeatherByCityName: (city: string) => Promise<void>;
  getWeatherByUserLocation: () => Promise<void>;
  clearWeatherData: () => void;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherDataType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'city' | 'location' | null>(null);
  const { saveLocation } = useLastLocation();
  const { searchCity, triggerSearch, setGlobalSearch } = useGlobalSearch();

  // Detectar cambios en weatherData para debugging
  useEffect(() => {
    console.log('🔄 useWeather: weatherData cambió a:', weatherData);
  }, [weatherData]);

  // Escuchar cambios de búsqueda global
  useEffect(() => {
    if (searchCity && triggerSearch) {
      console.log('🌍 useWeather: Búsqueda global detectada:', searchCity);
      getWeatherByCityName(searchCity);
    }
  }, [searchCity, triggerSearch]);

  const getWeatherByCityName = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    console.log('🔍 useWeather: Buscando ciudad:', city);
    console.log('🔍 useWeather: Estado actual - weatherData:', weatherData);
    console.log('🔍 useWeather: Estado actual - loading:', loading);
    
    setLoading(true);
    setSearchType('city');
    setError(null);
    
    try {
      const data = await getWeatherByCity(city.trim());
      console.log('✅ useWeather: Datos recibidos:', data);
      console.log('✅ useWeather: Estableciendo nuevos datos...');
      setWeatherData(data);
      console.log('✅ useWeather: Datos establecidos, weatherData ahora es:', data);
      
      // Guardar la última ubicación buscada
      await saveLocation(city.trim(), data);
      console.log('💾 useWeather: Ubicación guardada');
      
      // Activar búsqueda global para sincronizar con Forecast
      setGlobalSearch(city.trim(), data.pais);
      console.log('🌍 useWeather: Búsqueda global activada para:', city.trim());
    } catch (error: any) {
      console.error('❌ useWeather: Error:', error);
      setError(error.message || 'Could not get weather');
      // NO borrar weatherData - mantener datos anteriores
      console.log('⚠️ useWeather: Error en búsqueda, manteniendo datos anteriores');
    } finally {
      setLoading(false);
      console.log('🏁 useWeather: Búsqueda completada');
    }
  }, [saveLocation, weatherData, loading]);

  const getWeatherByUserLocation = useCallback(async () => {
    console.log('📍 useWeather: Iniciando búsqueda por ubicación del usuario');
    setLoading(true);
    setSearchType('location');
    setError(null);
    
    try {
      console.log('📍 useWeather: Obteniendo ubicación actual...');
      const position = await getCurrentLocation();
      console.log('📍 useWeather: Ubicación obtenida:', position);
      
      console.log('🌤️ useWeather: Obteniendo clima para coordenadas:', position.latitude, position.longitude);
      const data = await getWeatherByLocation(position.latitude, position.longitude);
      console.log('✅ useWeather: Clima obtenido para ubicación:', data);
      
      // Establecer los datos del clima (NO null)
      setWeatherData(data);
      console.log('✅ useWeather: weatherData establecido con datos de ubicación');
      
      // Guardar la última ubicación por coordenadas
      const locationName = data.ubicacion.nombre;
      await saveLocation(locationName, data);
      console.log('💾 useWeather: Ubicación guardada:', locationName);
      
      // Activar búsqueda global para sincronizar con Forecast
      setGlobalSearch(locationName, data.ubicacion.pais);
      console.log('🌍 useWeather: Búsqueda global activada para:', locationName);
    } catch (error: any) {
      console.error('❌ useWeather: Error al obtener ubicación:', error);
      setError(error.message || 'Could not get your location');
      // NO borrar weatherData - mantener datos anteriores
      console.log('⚠️ useWeather: Error en búsqueda por ubicación, manteniendo datos anteriores');
    } finally {
      setLoading(false);
      console.log('🏁 useWeather: Búsqueda por ubicación completada');
    }
  }, [saveLocation]);

  const clearWeatherData = useCallback(() => {
    setWeatherData(null);
    setSearchType(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weatherData,
    loading,
    error,
    searchType,
    getWeatherByCityName,
    getWeatherByUserLocation,
    clearWeatherData,
    clearError,
  };
};
