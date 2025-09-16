# Weather App Frontend

A clean and modern React Native weather application built with Expo Router, now fully connected to your backend API.

## 🚀 Features

- **Clean UI**: Minimalist design with essential functionality
- **Three Main Tabs**: Home, Explore, and Weather
- **Backend Integration**: Fully connected to your WeatherAPI.com backend
- **Real-time Weather Data**: Get current weather by city or GPS location
- **Responsive Design**: Works on iOS, Android, and Web
- **Theme Support**: Light and dark mode compatibility
- **Modern Architecture**: Built with Expo Router and TypeScript

## 🔗 Backend Connection

The app is now fully connected to your backend API with the following features:

- **Weather by City**: Search and get real-time weather data for any city
- **Weather by Location**: Use GPS to get weather for your current location
- **Real API Calls**: All data comes from WeatherAPI.com through your backend
- **Error Handling**: Proper error messages and loading states
- **Authentication**: Uses your API key for secure requests

## 📱 App Structure

### Tab Navigation
- **Home**: Welcome screen with app features overview
- **Explore**: Information about weather capabilities
- **Weather**: Weather search and display functionality (Connected to Backend)

### Components
- **ThemedText**: Text component with theme support
- **ThemedView**: View component with theme support
- **IconSymbol**: Simple icon component

### Services & Hooks
- **weatherService**: API client for backend communication
- **useWeather**: Custom hook for weather state management
- **api config**: Centralized API configuration

## 🛠️ Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Expo Router**: File-based routing system
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client for API calls
- **Expo Vector Icons**: Icon library

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Connection
```bash
# Copy the example config file
cp config.env.example .env

# Edit .env with your backend configuration
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_KEY=tu_clave_secreta_aqui
```

### 3. Start the Backend
Make sure your backend is running:
```bash
cd backend
npm run dev
```

### 4. Start the Frontend
```bash
npm start
```

### 5. Run on Platform
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

## 🔑 Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Your backend URL | `http://localhost:3000` |
| `EXPO_PUBLIC_API_KEY` | Your backend API key | `mi_clave_secreta` |

### Backend Requirements

Your backend must be running and accessible with:
- ✅ WeatherAPI.com integration
- ✅ API key authentication
- ✅ CORS enabled
- ✅ Endpoints: `/weather/city`, `/weather/location`, `/weather/forecast`

## 📡 API Integration

### Weather Service
The app uses a centralized weather service that handles:
- City-based weather search
- GPS location weather
- Error handling and loading states
- Type-safe API responses

### Authentication
All API calls include your secret API key in the `x-api-key` header.

### Error Handling
The app gracefully handles:
- Network errors
- Invalid city names
- GPS permission issues
- Backend errors

## 🧪 Testing the Connection

### 1. Start Both Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/WeatherApp
npm start
```

### 2. Test Weather Search
- Open the Weather tab
- Enter a city name (e.g., "Madrid")
- Press Search or Enter
- Verify real weather data appears

### 3. Test Location Weather
- Press "Usar Mi Ubicación"
- Grant location permissions
- Verify weather data for your location

## 🚨 Troubleshooting

### Common Issues

1. **"API key inválida" Error**
   - Check your `.env` file has the correct `EXPO_PUBLIC_API_KEY`
   - Verify the key matches your backend's `API_KEY_SECRETA`

2. **"Connection refused" Error**
   - Ensure your backend is running on the correct port
   - Check `EXPO_PUBLIC_API_URL` in your `.env` file

3. **"Ciudad no encontrada" Error**
   - Try a different city name
   - Check if your backend has a valid WeatherAPI.com key

4. **Location Permission Issues**
   - Grant location permissions in your device settings
   - Ensure you're testing on a device with GPS

### Debug Mode
Add console logs to see API calls:
```typescript
// In weatherService.ts
console.log('API Call:', `${API_CONFIG.ENDPOINTS.WEATHER_CITY}?city=${city}`);
```

## 📱 Platform Support

- ✅ iOS (with GPS support)
- ✅ Android (with GPS support)  
- ✅ Web (with geolocation API)
- ✅ Expo Go app

## 🚀 Deployment

### Expo Build
```bash
# Build for production
expo build:ios
expo build:android
expo build:web
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build and submit
eas build --platform all
eas submit --platform all
```

## 🔗 Backend Integration Details

### API Endpoints Used
- `GET /weather/city?city={nombre}` - Weather by city
- `GET /weather/location?lat={lat}&lon={lon}` - Weather by coordinates
- `GET /weather/forecast?city={nombre}&days={dias}` - Weather forecast

### Data Flow
1. User inputs city or requests location
2. Frontend calls backend API
3. Backend calls WeatherAPI.com
4. Data flows back through the chain
5. UI updates with real weather information

### Security
- All requests include your secret API key
- Backend validates the key before processing
- No sensitive data exposed in frontend

## 📄 License

ISC
