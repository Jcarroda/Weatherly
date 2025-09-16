import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useForecast } from '@/hooks/useForecast';

export default function ForecastScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { 
    forecastData, 
    loading, 
    error, 
    lastLocation,
    clearError,
    refreshForecast
  } = useForecast();

  // Efecto para hacer scroll al top y refrescar datos cuando se monte el componente
  useEffect(() => {
    console.log('🌤️ ForecastScreen: Componente montado, haciendo scroll al top...');
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
    
    // Refrescar el pronóstico cada vez que se accede a la pestaña
    console.log('🔄 ForecastScreen: Refrescando pronóstico al acceder a la pestaña');
    refreshForecast();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getWeatherIcon = (iconUrl: string) => {
    // WeatherAPI.com usa URLs como: //cdn.weatherapi.com/weather/64x64/day/113.png
    return iconUrl.startsWith('//') ? `https:${iconUrl}` : iconUrl;
  };

  const renderForecastCard = (day: any, index: number) => {
    // Debug: Mostrar los datos que llegan
    console.log('🌧️ Forecast Card Data:', {
      fecha: day.fecha,
      probabilidad_lluvia: day.probabilidad_lluvia,
      humedad: day.humedad,
      velocidad_viento: day.velocidad_viento,
      allData: day
    });

    return (
      <View key={index} style={styles.forecastCard}>
        {/* Header con fecha y día */}
        <View style={styles.cardHeader}>
          <ThemedText style={styles.dayName}>
            {formatDate(day.fecha)}
          </ThemedText>
          <View style={styles.temperatureContainer}>
            <ThemedText style={styles.maxTemp}>
              {Math.round(day.temperatura_max)}°
            </ThemedText>
            <ThemedText style={styles.tempSeparator}>/</ThemedText>
            <ThemedText style={styles.minTemp}>
              {Math.round(day.temperatura_min)}°
            </ThemedText>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.cardContent}>
          <View style={styles.weatherInfo}>
            <ThemedText style={styles.description}>
              {day.descripcion}
            </ThemedText>
          </View>
        </View>
        
        {/* Detalles del clima */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Image 
              source={require('@/assets/images/icons8-lluvia.gif')} 
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <ThemedText style={styles.detailLabel}>Rain</ThemedText>
            <ThemedText style={styles.detailValue}>
              {day.probabilidad_lluvia !== undefined ? `${day.probabilidad_lluvia}%` : 'N/A'}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Image 
              source={require('@/assets/images/icons8-agua-32.png')} 
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
            <ThemedText style={styles.detailValue}>{day.humedad}%</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Image 
              source={require('@/assets/images/icons8-viento.gif')} 
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <ThemedText style={styles.detailLabel}>Wind</ThemedText>
            <ThemedText style={styles.detailValue}>{day.velocidad_viento} km/h</ThemedText>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerCard}>
        <ThemedText type="subtitle" style={styles.cityName}>
          {forecastData ? forecastData.ciudad : lastLocation || 'Loading...'}
        </ThemedText>
        {forecastData && (
          <ThemedText style={styles.countryText}>
            {forecastData.region}, {forecastData.pais}
          </ThemedText>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.errorButton} onPress={clearError}>
              <ThemedText style={styles.errorButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        
        {renderHeader()}

        {forecastData && (
          <View style={styles.forecastContainer}>
            {forecastData.pronostico.map((day, index) => renderForecastCard(day, index))}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              Loading 14-day forecast...
            </ThemedText>
            <ThemedText style={styles.loadingSubText}>
              For {lastLocation || 'your location'}
            </ThemedText>
          </View>
        )}

        {!forecastData && !loading && !error && (
          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoText}>
              Waiting for location...
            </ThemedText>
            <ThemedText style={styles.infoSubText}>
              The forecast will load automatically
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FF3B30',
    flex: 1,
    fontSize: 14,
  },
  errorButton: {
    padding: 5,
  },
  errorButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerCard: {
    padding: 25,
    alignItems: 'center',
    marginBottom: 0,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  countryText: {
    fontSize: 16,
    color: '#000',
    opacity: 0.7,
    marginBottom: 10,
  },
  forecastContainer: {
    marginTop: 5,
  },
  forecastCard: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  cardContent: {
    marginBottom: 15,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 16,
    flex: 1,
    color: '#000',
    textAlign: 'left',
    fontWeight: '500',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maxTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tempSeparator: {
    fontSize: 20,
    color: '#000',
    opacity: 0.6,
    marginHorizontal: 5,
  },
  minTemp: {
    fontSize: 20,
    color: '#000',
    opacity: 0.7,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#000',
    opacity: 0.7,
    marginBottom: 3,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  loadingSubText: {
    textAlign: 'center',
    color: '#000',
    opacity: 0.7,
    fontSize: 14,
  },
  infoContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginVertical: 20,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  infoSubText: {
    textAlign: 'center',
    color: '#000',
    opacity: 0.7,
    fontSize: 14,
  },
});