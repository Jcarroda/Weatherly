import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G } from 'react-native-svg';
import * as Location from 'expo-location';
import { useWeather } from '@/hooks/useWeather';
import { useLastLocation } from '@/hooks/useLastLocation';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

const { width, height } = Dimensions.get('window');

interface CardProps {
  initialSearchCity?: string;
  initialSearchCountry?: string;
}

const Card: React.FC<CardProps> = ({ initialSearchCity, initialSearchCountry }) => {
  const [city, setCity] = useState('');
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { 
    weatherData, 
    loading, 
    error, 
    searchType,
    getWeatherByCityName, 
    getWeatherByUserLocation,
    clearError 
  } = useWeather();
  
  const { lastWeatherData, loading: locationLoading } = useLastLocation();
  const { setGlobalSearch } = useGlobalSearch();
  
  // Estado de carga combinado
  const isLoading = locationLoading || loading;
  
  // Usar datos del clima actual o la última ubicación guardada
  const currentWeatherData = weatherData || lastWeatherData;

  // Efecto para búsqueda automática cuando se reciben parámetros
  useEffect(() => {
    if (initialSearchCity && initialSearchCity.trim()) {
      console.log('🚀 sun: Búsqueda automática desde explore:', initialSearchCity);
      getWeatherByCityName(initialSearchCity.trim());
    }
  }, [initialSearchCity, initialSearchCountry]);
  
  // Logs de debug para ver qué datos se están recibiendo
  console.log('🌤️ sun: weatherData (búsqueda actual):', weatherData);
  console.log('💾 sun: lastWeatherData (última ubicación):', lastWeatherData);
  console.log('🎯 sun: currentWeatherData (datos a mostrar):', currentWeatherData);
  
  const handleCitySearch = async () => {
    if (city.trim()) {
      console.log('🔍 sun: Buscando ciudad:', city.trim());
      const cityName = city.trim();
      setCity(''); // Limpiar input inmediatamente
      
      // Activar búsqueda global para sincronizar con Forecast
      setGlobalSearch(cityName);
      
      await getWeatherByCityName(cityName);
    }
  };
  


  const handleLocationSearch = async () => {
    console.log('📍 sun: Iniciando búsqueda por ubicación...');
    setLocationError(null);
    
    try {
      // 1. En desarrollo, siempre solicitar permisos para asegurar que aparezca la notificación
      console.log('🔐 sun: Solicitando permisos de ubicación...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('🔐 sun: Status de permisos:', status);
      
      let finalStatus = status;
      
      // 3. Si los permisos fueron concedidos, obtener ubicación
      if (finalStatus === 'granted') {
        console.log('✅ sun: Permisos concedidos, obteniendo ubicación...');
        
        // Obtener ubicación actual
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        console.log('📍 sun: Ubicación obtenida:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        });
        
        // Obtener clima para esa ubicación
        await getWeatherByUserLocation();
        console.log('✅ sun: Ubicación y clima obtenidos correctamente');
        
        // Activar búsqueda global para sincronizar con Forecast
        // Nota: No podemos usar setGlobalSearch aquí porque no tenemos el nombre de la ciudad aún
        // La sincronización se manejará a través de useWeather que ya escucha cambios globales
        
      } else {
        // 4. Si los permisos fueron denegados, mostrar popup
        console.log('❌ sun: Permisos denegados, mostrando popup...');
        setShowLocationPermission(true);
        setLocationError('Location permissions denied');
      }
      
    } catch (error: any) {
      console.error('❌ sun: Error en handleLocationSearch:', error);
      
      if (error.message?.includes('denied') || error.message?.includes('Permiso de ubicación denegado')) {
        console.log('🔐 sun: Error de permisos, mostrando popup...');
        setShowLocationPermission(true);
        setLocationError('Location permissions denied');
      } else if (error.message?.includes('network') || error.message?.includes('ERR_FAILED')) {
        console.log('🌐 sun: Error de red, verificando permisos...');
        setLocationError('Connection error. Check your internet and location permissions.');
      } else {
        console.log('⚠️ sun: Error desconocido:', error.message);
        setLocationError('Error getting your current location');
      }
    }
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Loading...';
    
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const suffix = getDaySuffix(dayOfMonth);
    
    return `${day}, ${dayOfMonth}${suffix}`;
  };
  
  // Función para obtener el sufijo del día
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  // Función para obtener el nombre de la ubicación
  const getLocationName = () => {
    if (!currentWeatherData) return 'Loading...';
    
    if ('ubicacion' in currentWeatherData) {
      return currentWeatherData.ubicacion.nombre;
    }
    return currentWeatherData.ciudad;
  };
  
  // Función para obtener la localidad (ciudad)
  const getLocation = () => {
    if (!currentWeatherData) return 'Loading...';
    
    if ('ubicacion' in currentWeatherData) {
      return currentWeatherData.ubicacion.nombre;
    }
    return currentWeatherData.ciudad;
  };

  // Función para obtener el país
  const getCountry = () => {
    if (!currentWeatherData) return 'Loading...';
    
    if ('ubicacion' in currentWeatherData) {
      return currentWeatherData.ubicacion.pais;
    }
    return currentWeatherData.pais;
  };
  
  // Función para obtener la descripción del clima
  const getWeatherDescription = () => {
    if (!currentWeatherData) return 'Loading...';
    return currentWeatherData.descripcion;
  };
  
  // Función para obtener la temperatura
  const getTemperature = () => {
    if (!currentWeatherData) return '--';
    return Math.round(currentWeatherData.temperatura);
  };
  
  // Función para obtener la fecha actual
  const getCurrentDate = () => {
    return formatDate(new Date().toISOString());
  };
  
  return (
    <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.landscapeSection}>
          {/* SearchBar integrado */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                onSubmitEditing={handleCitySearch}
                returnKeyType="search"
                autoCapitalize="words"
                autoCorrect={false}
              />
              {city.length > 0 && (
                <TouchableOpacity onPress={() => setCity('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={handleCitySearch}
                disabled={loading || !city.trim()}
              >
                <Ionicons 
                  name={loading && searchType === 'city' ? "hourglass" : "arrow-forward"} 
                  size={20} 
                  color={loading || !city.trim() ? "#ccc" : "#007AFF"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleLocationSearch}
                disabled={loading}
                style={styles.locationIconButton}
              >
                <Ionicons 
                  name="location" 
                  size={20} 
                  color={loading ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Botón de ubicación actual */}
          
          {/* Botón de debug para forzar permisos */}
          
          
          {/* Indicador de error de ubicación */}
          {locationError && (
            <View style={styles.locationErrorContainer}>
              <Text style={styles.locationErrorText}>⚠️ {locationError}</Text>
              <TouchableOpacity 
                onPress={() => setLocationError(null)}
                style={styles.locationErrorClose}
              >
                <Text style={styles.locationErrorCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Indicador de error de búsqueda (pero mantiene datos anteriores) */}
          {error && currentWeatherData && (
            <View style={styles.searchErrorContainer}>
              <Text style={styles.searchErrorText}>
                ⚠️ {error} - Mostrando datos de {getLocationName()}
              </Text>
              <TouchableOpacity 
                onPress={clearError}
                style={styles.searchErrorClose}
              >
                <Text style={styles.searchErrorCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Popup de permisos de localización */}
          {showLocationPermission && (
            <View style={styles.permissionPopup}>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>Location Permissions</Text>
                <Text style={styles.permissionText}>
                  To show you the weather for your current location, we need access to geolocation.
                </Text>
                <Text style={styles.permissionSubtext}>
                  📱 Go to Settings → Apps → WeatherApp → Permissions → Location
                </Text>
                <View style={styles.permissionButtons}>
                  <TouchableOpacity 
                    style={styles.permissionButton}
                    onPress={() => setShowLocationPermission(false)}
                  >
                    <Text style={styles.permissionButtonText}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          
        <View style={styles.weatherInfo}>
            <View style={styles.leftSide}>
              <View style={styles.icon}>
                <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <G strokeWidth={0} id="SVGRepo_bgCarrier" />
                  <G strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                  <G id="SVGRepo_iconCarrier">
                    <Path strokeLinecap="round" strokeWidth="1.5" stroke="#ffffff" d="M22 14.3529C22 17.4717 19.4416 20 16.2857 20H11M14.381 9.02721C14.9767 8.81911 15.6178 8.70588 16.2857 8.70588C16.9404 8.70588 17.5693 8.81468 18.1551 9.01498M7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C2 18.1038 3.91878 20 6.28571 20H7M7.11616 11.6089C6.88706 10.9978 6.7619 10.3369 6.7619 9.64706C6.7619 6.52827 9.32028 4 12.4762 4C15.4159 4 17.8371 6.19371 18.1551 9.01498M7.11616 11.6089C7.68059 11.7184 8.20528 11.9374 8.66667 12.2426M18.1551 9.01498C18.8381 9.24853 19.4623 9.60648 20 10.0614" />
                  </G>
                </Svg>
              </View>
              <Text style={styles.conditionText}>{getWeatherDescription()}</Text>
            </View>
            <View style={styles.rightSide}>
               <View style={styles.locationContainer}>
                 <Text style={styles.locationText}>{getLocation()}</Text>
               </View>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
              <Text style={styles.temperatureText}>{getTemperature()}°C</Text>
            </View>
            

          </View>
          
          <LinearGradient
            colors={['#E96594', '#F7E157']}
            style={styles.sky}
          />
          
          <View style={styles.sun}>
            <View style={styles.sunAfter} />
            <View style={styles.sunBefore} />
          </View>
          
          <View style={styles.hill1} />
          <View style={styles.hill2} />
          
          <View style={styles.ocean}>
            <View style={styles.reflection1} />
            <View style={styles.reflection2} />
            <View style={styles.reflection3} />
            <View style={styles.reflection4} />
            <View style={styles.reflection5} />
            <View style={styles.shadowHill1} />
            <View style={styles.shadowHill2} />
          </View>
          
          <View style={styles.hill3} />
          <View style={styles.hill4} />
          
          <View style={styles.tree1}>
            <Svg width="50" height="70" viewBox="0 0 64.00 64.00">
              <G strokeWidth={0} id="SVGRepo_bgCarrier" />
              <G strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
              <G id="SVGRepo_iconCarrier">
                <Path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" fill="#b77873" />
              </G>
            </Svg>
          </View>
          
          <View style={styles.tree2}>
            <Svg width="50" height="70" viewBox="0 0 64.00 64.00">
              <G strokeWidth={0} id="SVGRepo_bgCarrier" />
              <G strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
              <G id="SVGRepo_iconCarrier">
                <Path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" fill="#b77873" />
              </G>
            </Svg>
          </View>
          
          <View style={styles.tree3}>
            <Svg width="65" height="80" viewBox="0 0 64.00 64.00">
              <G id="SVGRepo_bgCarrier" strokeWidth={0} />
              <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
              <G id="SVGRepo_iconCarrier">
                <Path fill="#a16773" d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
              </G>
            </Svg>
          </View>
          
          <View style={styles.filter} />
        </View>
        
        <View style={styles.contentSection}>
                     <View style={styles.forecast}>
            {currentWeatherData ? (
              <>
              <View style={styles.forecastItem}>
                   <Text style={styles.forecastDay}>Current Weather</Text>
                   <Text style={styles.forecastTemp}>{getTemperature()}°C</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.forecastItem}>
                   <Text style={styles.forecastDay}>Country</Text>
                   <Text style={styles.forecastTemp}>{getCountry()}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.forecastItem}>
                   <Text style={styles.forecastDay}>Location</Text>
                   <Text style={styles.forecastTemp}>{getLocationName()}</Text>
              </View>
             <View style={styles.separator} />
             <View style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>Humidity</Text>
                  <Text style={styles.forecastTemp}>{currentWeatherData.humedad}%</Text>
             </View>
             <View style={styles.separator} />
             <View style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>Wind</Text>
                  <Text style={styles.forecastTemp}>{currentWeatherData.velocidad_viento} km/h</Text>
             </View>
             <View style={styles.separator} />
             <View style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>Pressure</Text>
                  <Text style={styles.forecastTemp}>{currentWeatherData.presion} mb</Text>
                </View>
              </>
            ) : (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastDay}>No weather data available</Text>
                <Text style={styles.forecastTemp}>Search for a city or use location</Text>
             </View>
            )}
                      </View>
         </View>
       </View>
     </ScrollView>
   );
 };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    
    backgroundColor: '#f5f5f5',
  },

  card: {
    width: width,
    minHeight: height,
  },

  /* Landscape section */
  landscapeSection: {
    position: 'relative',
    width: '100%',
    minHeight: height * 0.9,
    overflow: 'hidden',
  },

  /* Search components */
  searchContainer: {
 
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1000,
    marginTop: 40,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    maxWidth: 350,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },





  searchIcon: {
    marginRight: 10,
  },

  clearButton: {
    marginRight: 10,
    padding: 2,
  },

  locationIconButton: {
    marginLeft: 10,
    padding: 2,
  },

  /* Popup de permisos */
  permissionPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },

  permissionContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  permissionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },

  permissionSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
    fontStyle: 'italic',
  },

  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  permissionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },

  permissionButtonPrimary: {
    backgroundColor: '#007AFF',
  },

  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },

  permissionButtonTextPrimary: {
    color: 'white',
  },

  /* Indicador de error de ubicación */
  locationErrorContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationErrorText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  locationErrorClose: {
    padding: 5,
  },

  locationErrorCloseText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Indicador de error de búsqueda (mantiene datos anteriores) */
  searchErrorContainer: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchErrorText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  searchErrorClose: {
    padding: 5,
  },

  searchErrorCloseText: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: 'bold',
  },

  locationButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },

  locationButtonDisabled: {
    opacity: 0.6,
  },

  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  debugButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 20,
  },

  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  sky: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  sun: {
    marginBottom: 50,
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    bottom: '35%',
    left: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1.5 }],
  },

  sunAfter: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: 'white',
    opacity: 0.5,
  },

  sunBefore: {
    position: 'absolute',
    width: 107,
    height: 107,
    borderRadius: 53.5,
    backgroundColor: 'white',
    opacity: 0.1,
  },

  ocean: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 0,
    width: '100%',
    height: '28%',
    backgroundColor: '#F1C07D',
  },

  reflection1: {
    position: 'absolute',
    width: 290,
    height: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    top: '5%',
    left: '32%',
    zIndex: 1,
  },

  reflection2: {
    position: 'absolute',
    width: 250,
    height: 3,
    backgroundColor: 'white',
    opacity: 0.5,
    top: '15%',
    left: '39%',
    zIndex: 1,
  },

  reflection3: {
    position: 'absolute',
    width: 300,
    height: 4,
    backgroundColor: 'white',
    opacity: 0.5,
    top: '27%',
    right: '15%',
    zIndex: 1,
  },

  reflection4: {
    position: 'absolute',
    width: 180,
    height: 4,
    backgroundColor: 'white',
    opacity: 0.5,
    top: '37%',
    right: '25%',
    zIndex: 1,
  },

  reflection5: {
    position: 'absolute',
    width: 200,
    height: 6,
    backgroundColor: 'white',
    opacity: 0.5,
    top: '46%',
    right: '10%',
    zIndex: 1,
  },

  hill1: {
    position: 'absolute',
    right: -100,
    bottom: '20%',
    width: 260,
    height: 80,
    borderRadius: 300,
    backgroundColor: '#e6b29d',
  },

  shadowHill1: {
    position: 'absolute',
    right: -100,
    top: -60,
    width: 265,
    height: 80,
    borderRadius: 150,
    backgroundColor: '#f1c7a0',
    opacity: 1,
  },

  hill2: {
    position: 'absolute',
    right: -180,
    bottom: '10%',
    width: 300,
    height: 160,
    borderRadius: 150,
    backgroundColor: '#c29182',
  },

  shadowHill2: {
    position: 'absolute',
    right: -180,
    top: -130,
    width: 305,
    height: 200,
    borderRadius: 150,
    backgroundColor: '#e5bb96',
    opacity: 1,
  },

  hill3: {
    position: 'absolute',
    left: -400,
    bottom: -140,
    width: 600,
    height: 270,
    borderRadius: 2000,
    backgroundColor: '#b77873',
    zIndex: 3,
  },

  tree1: {
    position: 'absolute',
    bottom: '15%',
    left: '0%',
    width: 100,
    height: 140,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 2 }],
  },

  tree2: {
    position: 'absolute',
    bottom: '12%',
    left: '23%',
    width: 100,
    height: 140,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1.8 }],
  },

  hill4: {
    position: 'absolute',
    right: -400,
    bottom: -200,
    width: 650,
    height: 300,
    borderRadius: 350,
    backgroundColor: '#a16773',
    zIndex: 3,
  },

  tree3: {
    position: 'absolute',
    bottom: '12%',
    right: '5%',
    width: 130,
    height: 160,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 2 }],
  },

  filter: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 5,
    opacity: 0.2,

  },

  /* Content section */
  contentSection: {
    width: '100%',
    minHeight: height * 0.3,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  weatherInfo: {
    position: 'absolute',
    top: 120,
    right: 0,
    width: '100%',
    paddingTop: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  leftSide: {
    alignItems: 'center',
    width: '20%',
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  conditionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  rightSide: {
    alignItems: 'flex-end',
  },

  locationContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    opacity: 0.9,
  },

  dateText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },

  temperatureText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },



  forecast: {
    width: '100%',
    minHeight: height * 0.25,
    justifyContent: 'space-evenly',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },

  forecastItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  forecastDay: {
    color: 'lightslategray',
    fontSize: 16,
    fontWeight: '500',
  },

  forecastTemp: {
    color: 'lightslategray',
    fontSize: 16,
    fontWeight: '600',
  },

  separator: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgb(233, 233, 233)',
    borderRadius: 2,
    marginVertical: 10,
  },
});

export default Card;
