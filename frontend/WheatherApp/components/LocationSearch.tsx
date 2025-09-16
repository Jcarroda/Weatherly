import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';
import { getWeatherByCity } from '@/services/weatherService';

interface LocationSearchProps {
  onLocationSelect?: (city: string, country: string) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  
  const { addFavorite, isFavorite, forceRefresh } = useFavoriteLocations();



  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    // Limpiar mensajes anteriores
    setMessage(null);
    setMessageType(null);
  }, []);

  const handleSubmit = async () => {
    console.log('🔍 LocationSearch: handleSubmit llamado con:', searchQuery);
    
    if (!searchQuery.trim()) {
      setMessage('Por favor ingresa el nombre de una ciudad');
      setMessageType('error');
      return;
    }

    try {
      // Consultar la API para verificar si la ciudad existe
      console.log('🔍 LocationSearch: Consultando API para:', searchQuery.trim());
      const weatherData = await getWeatherByCity(searchQuery.trim());
      
      if (weatherData && weatherData.ciudad) {
        const cityName = weatherData.ciudad;
        const countryName = weatherData.pais;
        
        console.log('🔍 LocationSearch: Ciudad encontrada en API:', cityName, countryName);
        
        // Verificar si ya es favorito
        const alreadyFavorite = isFavorite(cityName, countryName);
        console.log('🔍 LocationSearch: ¿Ya es favorito?', alreadyFavorite);
        
        if (alreadyFavorite) {
          setMessage(`${cityName}, ${countryName} ya está en tus favoritos`);
          setMessageType('error');
        } else {
          // Agregar a favoritos
          console.log('🔍 LocationSearch: Intentando agregar a favoritos:', cityName, countryName);
          const success = await addFavorite(cityName, countryName);
          console.log('🔍 LocationSearch: Resultado de addFavorite:', success);
          
          if (success) {
            setMessage(`${cityName}, ${countryName} agregado a favoritos`);
            setMessageType('success');
            setSearchQuery('');
            
            // Forzar refresh inmediato
            console.log('🔍 LocationSearch: Forzando refresh después de agregar favorito');
            forceRefresh();
            
            // Navegar a la ciudad después de un breve delay
            setTimeout(() => {
              if (onLocationSelect) {
                console.log('🔍 LocationSearch: Navegando a:', cityName, countryName);
                onLocationSelect(cityName, countryName);
              }
            }, 1500);
          } else {
            setMessage('Error al agregar a favoritos. Intenta de nuevo.');
            setMessageType('error');
          }
        }
      } else {
        setMessage('Ciudad no encontrada. Intenta con otra ciudad');
        setMessageType('error');
      }
    } catch (error) {
      console.error('🔍 LocationSearch: Error consultando API:', error);
      setMessage('Error al consultar la ciudad. Intenta de nuevo.');
      setMessageType('error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter a city name..."
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
        
        {/* Botón de debug temporal */}
        <TouchableOpacity 
          onPress={() => {
            console.log('🔍 LocationSearch: Botón debug presionado');
            console.log('🔍 LocationSearch: Estado actual:', { searchQuery, message, messageType });
            console.log('🔍 LocationSearch: Hook values:', { addFavorite, isFavorite });
          }}
          style={styles.debugButton}
        >
          <Ionicons name="bug" size={16} color="#666" />
        </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
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
  debugButton: {
    padding: 8,
    marginLeft: 8,
  },
  
  /* Estilos para mensajes */
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
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
