import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, TextInput, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';
import { FavoriteLocationCard } from '@/components/FavoriteLocationCard';
import { useRouter } from 'expo-router';
import { getWeatherByCity } from '@/services/weatherService';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

export default function ExploreScreen() {
  const router = useRouter();
  const { favorites, loading, removeFavorite, addFavorite, isFavorite } = useFavoriteLocations();
  const { setGlobalSearch } = useGlobalSearch();
  const [showFavorites, setShowFavorites] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Log para debug
  console.log('🌍 ExploreScreen: favorites actuales:', favorites);
  console.log('🌍 ExploreScreen: loading:', loading);
  console.log('🌍 ExploreScreen: showFavorites:', showFavorites);
  console.log('🌍 ExploreScreen: favorites.length:', favorites.length);

  // Efecto para hacer scroll al top cuando se monte el componente
  useEffect(() => {
    console.log('🌍 ExploreScreen: Componente montado, haciendo scroll al top...');
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  }, []);

  const handleLocationPress = (location: any) => {
    console.log('🌍 ExploreScreen: Favorito seleccionado:', location.name, location.country);
    
    // Activar búsqueda global en toda la app
    setGlobalSearch(location.name, location.country);
    
    // Navegar al Home para ver los resultados
    router.push('/(tabs)');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Limpiar mensajes anteriores
    setMessage(null);
    setMessageType(null);
  };

  const handleSubmit = async () => {
    if (!searchQuery.trim()) {
      setMessage('Por favor ingresa el nombre de una ciudad');
      setMessageType('error');
      return;
    }

    try {
      // Consultar la API para verificar si la ciudad existe
      console.log('🔍 ExploreScreen: Consultando API para:', searchQuery.trim());
      const weatherData = await getWeatherByCity(searchQuery.trim());
      
      if (weatherData && weatherData.ciudad) {
        const cityName = weatherData.ciudad;
        const countryName = weatherData.pais;
        
        console.log('🔍 ExploreScreen: Ciudad encontrada en API:', cityName, countryName);
        
        // Verificar si ya es favorito
        const alreadyFavorite = isFavorite(cityName, countryName);
        console.log('🔍 ExploreScreen: ¿Ya es favorito?', alreadyFavorite);
        
        if (alreadyFavorite) {
          setMessage(`${cityName}, ${countryName} ya está en tus favoritos`);
          setMessageType('error');
        } else {
          // Agregar a favoritos
          console.log('🔍 ExploreScreen: Intentando agregar a favoritos:', cityName, countryName);
          const success = await addFavorite(cityName, countryName);
          console.log('🔍 ExploreScreen: Resultado de addFavorite:', success);
          
          if (success) {
            setMessage(`${cityName}, ${countryName} agregado a favoritos`);
            setMessageType('success');
            setSearchQuery('');
            
            // NO navegar automáticamente - solo mostrar mensaje de éxito
            console.log('🔍 ExploreScreen: Ciudad agregada a favoritos, sin navegación automática');
          } else {
            setMessage('Error adding to favorites. Try again.');
            setMessageType('error');
          }
        }
      } else {
        setMessage('City not found. Try another city');
        setMessageType('error');
      }
    } catch (error) {
      console.error('🔍 ExploreScreen: Error consultando API:', error);
      setMessage('Error querying city. Try again.');
      setMessageType('error');
    }
  };

  const handleRemoveFavorite = (id: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this location from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(id) }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Buscador de ubicaciones */}
        <View style={styles.searchSection}>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Save city..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setMessage(null);
                  setMessageType(null);
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Mensaje de resultado */}
          {message && (
            <View style={[
              styles.messageContainer,
              messageType === 'success' ? styles.successMessage : styles.errorMessage
            ]}>
              <Ionicons 
                name={messageType === 'success' ? "checkmark-circle" : "alert-circle"} 
                size={20} 
                color={messageType === 'success' ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[
                styles.messageText,
                messageType === 'success' ? styles.successMessageText : styles.errorMessageText
              ]}>
                {message}
              </Text>
            </View>
          )}
        </View>

        {/* Sección de Sitios de Interés */}
        <View style={styles.favoritesSection}>
          <View style={styles.favoritesHeader}>

          </View>

          {showFavorites && (
            <View style={styles.favoritesContent}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ThemedText style={styles.loadingText}>Loading favorites...</ThemedText>
                </View>
              ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="heart-outline" size={48} color="#999" />
                  <ThemedText style={styles.emptyTitle}>You have no favorite places</ThemedText>
                  <ThemedText style={styles.emptyText}>
                    Search for cities in the Explore tab and add them as favorites to access them from here
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.favoritesList}>
                  {(() => {
                    console.log('🌍 ExploreScreen: Renderizando', favorites.length, 'favoritos');
                    return favorites.map((location, index) => {
                      console.log('🌍 ExploreScreen: Renderizando favorito', index, ':', location);
                      return (
                        <FavoriteLocationCard
                          key={location.id}
                          location={location}
                          onRemove={handleRemoveFavorite}
                          onPress={handleLocationPress}
                        />
                      );
                    });
                  })()}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },

  /* Estilos para la sección de búsqueda */
  searchSection: {
    marginBottom: 0,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 16,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 0,
    textAlign: 'center',
  },

  /* Estilos para la sección de favoritos */
  favoritesSection: {
    marginBottom: 0,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 16,
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 123, 255, 0)',
  },
  favoritesContent: {
    minHeight: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 0,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  favoritesList: {
    gap: 8,
  },
  
  /* Estilos para el buscador integrado */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 2,
  },
  
  /* Estilos para mensajes */
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  successMessage: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  successMessageText: {
    color: '#34C759',
  },
  errorMessageText: {
    color: '#FF3B30',
  },
});
