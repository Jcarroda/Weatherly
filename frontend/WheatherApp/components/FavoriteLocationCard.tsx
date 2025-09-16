import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoriteLocation } from '@/hooks/useFavoriteLocations';

interface FavoriteLocationCardProps {
  location: FavoriteLocation;
  onRemove: (id: string) => void;
  onPress: (location: FavoriteLocation) => void;
}

export const FavoriteLocationCard: React.FC<FavoriteLocationCardProps> = ({
  location,
  onRemove,
  onPress,
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(location)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={15} color="rgb(86, 124, 206)" />
            <Text style={styles.countryText}>{location.country}</Text>
          </View>
          
          <Text style={styles.dateText}>Added: {formatDate(location.timestamp)}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(location.id)}
            activeOpacity={0.6}
          >
            <Ionicons name="close-circle" size={24} color="rgb(255, 124, 124)" />
          </TouchableOpacity>
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 0,
    marginBottom: 1,
  },
  countryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    padding: 4,
  },
});
