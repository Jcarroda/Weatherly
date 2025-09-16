import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  timestamp: string;
}

const FAVORITE_LOCATIONS_KEY = 'favorite_locations';

export const useFavoriteLocations = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [removedFavorites, setRemovedFavorites] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar favoritos al iniciar
  useEffect(() => {
    console.log('🔄 useFavoriteLocations: useEffect ejecutado, cargando favoritos...');
    loadFavorites();
  }, []);

  // Cargar favoritos desde AsyncStorage
  const loadFavorites = async () => {
    try {
      console.log('🔄 useFavoriteLocations: loadFavorites ejecutado');
      const savedFavorites = await AsyncStorage.getItem(FAVORITE_LOCATIONS_KEY);
      console.log('🔄 useFavoriteLocations: AsyncStorage data:', savedFavorites);
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        console.log('🔄 useFavoriteLocations: Favoritos parseados:', parsedFavorites);
        setFavorites(parsedFavorites);
      } else {
        console.log('🔄 useFavoriteLocations: No hay favoritos guardados');
      }
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
    } finally {
      setLoading(false);
      console.log('🔄 useFavoriteLocations: Loading completado');
    }
  };

  // Agregar nueva ubicación favorita
  const addFavorite = async (name: string, country: string) => {
    try {
      console.log('🔄 useFavoriteLocations: addFavorite llamado con:', name, country);
      console.log('🔄 useFavoriteLocations: favorites actuales:', favorites);
      
      const newFavorite: FavoriteLocation = {
        id: `${name}-${country}-${Date.now()}`,
        name,
        country,
        timestamp: new Date().toISOString(),
      };

      console.log('🔄 useFavoriteLocations: Nuevo favorito creado:', newFavorite);

      const updatedFavorites = [...favorites, newFavorite];
      console.log('🔄 useFavoriteLocations: Lista actualizada:', updatedFavorites);
      
      await AsyncStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(updatedFavorites));
      console.log('🔄 useFavoriteLocations: Guardado en AsyncStorage');
      
      setFavorites(updatedFavorites);
      setRefreshTrigger(prev => prev + 1);
      console.log('🔄 useFavoriteLocations: Estado actualizado y refresh disparado');
      
      console.log('✅ Favorito agregado exitosamente:', newFavorite);
      return true;
    } catch (error) {
      console.error('❌ Error adding favorite:', error);
      return false;
    }
  };

  // Remover ubicación favorita
  const removeFavorite = async (id: string) => {
    try {
      const favoriteToRemove = favorites.find(fav => fav.id === id);
      if (favoriteToRemove) {
        // Marcar como removido
        const key = `${favoriteToRemove.name.toLowerCase()}-${favoriteToRemove.country.toLowerCase()}`;
        setRemovedFavorites(prev => new Set(prev).add(key));
        console.log('🗑️ Favorito marcado como removido:', key);
      }
      
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setRefreshTrigger(prev => prev + 1);
      
      console.log('🗑️ Favorito removido y refresh disparado:', id);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  // Verificar si una ubicación ya es favorita
  const isFavorite = (name: string, country: string) => {
    console.log('🔍 useFavoriteLocations: isFavorite llamado con:', name, country);
    console.log('🔍 useFavoriteLocations: favorites actuales:', favorites);
    
    // Verificar si está en la lista de favoritos
    const isInFavorites = favorites.some(fav => 
      fav.name.toLowerCase() === name.toLowerCase() && 
      fav.country.toLowerCase() === country.toLowerCase()
    );
    
    // Verificar si fue removido
    const key = `${name.toLowerCase()}-${country.toLowerCase()}`;
    const wasRemoved = removedFavorites.has(key);
    
    const result = isInFavorites && !wasRemoved;
    console.log('🔍 useFavoriteLocations: ¿Es favorito?', result, '(removido:', wasRemoved, ')');
    return result;
  };

  // Limpiar todos los favoritos
  const clearAllFavorites = async () => {
    try {
      await AsyncStorage.removeItem(FAVORITE_LOCATIONS_KEY);
      setFavorites([]);
      setRefreshTrigger(prev => prev + 1);
      console.log('🗑️ Todos los favoritos removidos');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  };

  // Función para forzar refresh
  const forceRefresh = useCallback(() => {
    console.log('🔄 useFavoriteLocations: Forzando refresh...');
    console.log('🔄 useFavoriteLocations: refreshTrigger anterior:', refreshTrigger);
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log('🔄 useFavoriteLocations: Nuevo refreshTrigger:', newValue);
      return newValue;
    });
  }, [refreshTrigger]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    loadFavorites,
    forceRefresh,
    refreshTrigger,
  };
};
