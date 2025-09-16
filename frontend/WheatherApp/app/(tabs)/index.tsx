import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SunCard from '@/components/sun';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Si hay parámetros de búsqueda, pasarlos al componente SunCard
  const searchCity = params.searchCity as string;
  const searchCountry = params.searchCountry as string;

  // Efecto para hacer scroll al top cuando se monte el componente
  useEffect(() => {
    console.log('🌤️ HomeScreen: Componente montado, haciendo scroll al top...');
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SunCard 
          initialSearchCity={searchCity}
          initialSearchCountry={searchCountry}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
