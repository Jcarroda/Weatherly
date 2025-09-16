import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Ref para evitar bucle infinito
  const lastSearchRef = useRef<string | null>(null);

  // Detectar cambios en weatherData para debugging
  useEffect(() => {
    console.log('🔄 useWeather: weatherData cambió a:', weatherData);
  }, [weatherData]);

  // Escuchar cambios de búsqueda global (SOLO si es diferente a la última búsqueda)
  useEffect(() => {
    if (searchCity && triggerSearch && searchCity !== lastSearchRef.current) {
      console.log('🌍 useWeather: Búsqueda global detectada:', searchCity);
      lastSearchRef.current = searchCity;
      getWeatherByCityName(searchCity);
    }
  }, [searchCity, triggerSearch]);

  const getWeatherByCityName = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    // Evitar búsquedas duplicadas
    if (loading) {
      console.log('⚠️ useWeather: Ya hay una búsqueda en progreso, ignorando...');
      return;
    }

    console.log('🔍 useWeather: Buscando ciudad:', city);
    
    setLoading(true);
    setSearchType('city');
    setError(null);
    
    try {
      const data = await getWeatherByCity(city.trim());
      console.log('✅ useWeather: Datos recibidos:', data);
      setWeatherData(data);
      
      // Guardar la última ubicación buscada
      await saveLocation(city.trim(), data);
      console.log('💾 useWeather: Ubicación guardada');
      
      // Activar búsqueda global para sincronizar con Forecast (SOLO si es diferente)
      if (data.ciudad !== lastSearchRef.current) {
        setGlobalSearch(city.trim(), data.pais);
        console.log('🌍 useWeather: Búsqueda global activada para:', city.trim());
      }
    } catch (error: any) {
      console.error('❌ useWeather: Error:', error);
      setError(error.message || 'Could not get weather');
    } finally {
      setLoading(false);
      console.log('�� useWeather: Búsqueda completada');
    }
  }, [saveLocation, setGlobalSearch, loading]); // Removidas las dependencias problemáticas

  const getWeatherByUserLocation = useCallback(async () => {
    if (loading) {
      console.log('⚠️ useWeather: Ya hay una búsqueda en progreso, ignorando...');
      return;
    }

    console.log('�� useWeather: Iniciando búsqueda por ubicación del usuario');
    setLoading(true);
    setSearchType('location');
    setError(null);
    
    try {
      const position = await getCurrentLocation();
      console.log('📍 useWeather: Ubicación obtenida:', position);
      
      const data = await getWeatherByLocation(position.latitude, position.longitude);
      console.log('✅ useWeather: Clima obtenido para ubicación:', data);
      
      setWeatherData(data);
      
      // Guardar la última ubicación por coordenadas
      const locationName = data.ubicacion.nombre;
      await saveLocation(locationName, data);
      console.log('💾 useWeather: Ubicación guardada:', locationName);
      
      // Activar búsqueda global para sincronizar con Forecast (SOLO si es diferente)
      if (locationName !== lastSearchRef.current) {
        setGlobalSearch(locationName, data.ubicacion.pais);
        console.log('�� useWeather: Búsqueda global activada para:', locationName);
      }
    } catch (error: any) {
      console.error('❌ useWeather: Error al obtener ubicación:', error);
      setError(error.message || 'Could not get your location');
    } finally {
      setLoading(false);
      console.log('🏁 useWeather: Búsqueda por ubicación completada');
    }
  }, [saveLocation, setGlobalSearch, loading]);

  const clearWeatherData = useCallback(() => {
    setWeatherData(null);
    setSearchType(null);
    lastSearchRef.current = null;
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