import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { useLastLocation } from './useLastLocation';
import { useGlobalSearch } from './useGlobalSearch';

interface ForecastDay {
  fecha: string;
  temperatura_max: number;
  temperatura_min: number;
  descripcion: string;
  icono: string;
  probabilidad_lluvia: number;
  humedad: number;
  velocidad_viento: number;
}

interface ForecastData {
  ciudad: string;
  pais: string;
  region: string;
  hora_local: string;
  pronostico: ForecastDay[];
}

interface ForecastResponse {
  success: boolean;
  data: ForecastData;
  timestamp: string;
}

export const useForecast = () => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lastLocation, loading: lastLocationLoading } = useLastLocation();
  const { searchCity, triggerSearch } = useGlobalSearch();

  // Cargar pronóstico automáticamente cuando se obtiene la última ubicación
  useEffect(() => {
    if (lastLocation && !lastLocationLoading) {
      console.log('🌤️ useForecast: Cargando pronóstico para última ubicación:', lastLocation);
      getForecastByCity(lastLocation, 14);
    }
  }, [lastLocation, lastLocationLoading]);

  // Hacer nueva consulta cada vez que se monte el componente
  useEffect(() => {
    if (lastLocation && !lastLocationLoading) {
      console.log('🔄 useForecast: Componente montado, haciendo nueva consulta para:', lastLocation);
      getForecastByCity(lastLocation, 14);
    }
  }, []); // Array vacío para que se ejecute solo al montar

  // Escuchar cambios de búsqueda global
  useEffect(() => {
    if (searchCity && triggerSearch) {
      console.log('🌍 useForecast: Búsqueda global detectada:', searchCity);
      getForecastByCity(searchCity, 14);
    }
  }, [searchCity, triggerSearch]);

  const getForecastByCity = async (city: string, days: number = 14) => {
    if (!city.trim()) {
      setError('No location available to get forecast');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error getting forecast');
      }

      const result: ForecastResponse = await response.json();
      
      if (result.success && result.data) {
        setForecastData(result.data);
      } else {
        throw new Error('Could not get forecast');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearForecast = () => {
    setForecastData(null);
    setError(null);
  };

  const refreshForecast = () => {
    if (lastLocation) {
      console.log('🔄 useForecast: Refrescando pronóstico para:', lastLocation);
      getForecastByCity(lastLocation, 14);
    }
  };

  return {
    forecastData,
    loading: loading || lastLocationLoading,
    error,
    lastLocation,
    getForecastByCity,
    clearError,
    clearForecast,
    refreshForecast,
  };
};
