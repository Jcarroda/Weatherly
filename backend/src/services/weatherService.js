import axios from "axios";

export const getWeatherByCity = async (city) => {
  const apiKey = "be245e559c5d4cc4908134721251609";
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
    const { data } = await axios.get(url);
    
    return {
      ciudad: data.location.name,
      pais: data.location.country,
      region: data.location.region,
      temperatura: data.current.temp_c,
      temperatura_f: data.current.temp_f,
      descripcion: data.current.condition.text,
      icono: data.current.condition.icon,
      humedad: data.current.humidity,
      velocidad_viento: data.current.wind_kph,
      presion: data.current.pressure_mb,
      visibilidad: data.current.vis_km,
      uv: data.current.uv,
      hora_local: data.location.localtime,
      ultima_actualizacion: data.current.last_updated
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('API key inválida para WeatherAPI.com');
    }
    if (error.response?.status === 400) {
      throw new Error('Ciudad no encontrada');
    }
    throw new Error(`Error al obtener datos del clima: ${error.message}`);
  }
};

export const getWeatherByLocation = async (lat, lon) => {
  const apiKey = process.env.WEATHERAPI_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

  try {
    const { data } = await axios.get(url);
    
    return {
      ubicacion: {
        lat: data.location.lat,
        lon: data.location.lon,
        nombre: data.location.name,
        pais: data.location.country,
        region: data.location.region
      },
      temperatura: data.current.temp_c,
      temperatura_f: data.current.temp_f,
      descripcion: data.current.condition.text,
      icono: data.current.condition.icon,
      humedad: data.current.humidity,
      velocidad_viento: data.current.wind_kph,
      presion: data.current.pressure_mb,
      visibilidad: data.current.vis_km,
      uv: data.current.uv,
      hora_local: data.location.localtime,
      ultima_actualizacion: data.current.last_updated
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('API key inválida para WeatherAPI.com');
    }
    if (error.response?.status === 400) {
      throw new Error('Coordenadas inválidas');
    }
    throw new Error(`Error al obtener datos del clima: ${error.message}`);
  }
};

export const getWeatherForecast = async (city, days = 14) => {
  const apiKey = "be245e559c5d4cc4908134721251609";
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`;

  try {
    const { data } = await axios.get(url);
    
    return {
      ciudad: data.location.name,
      pais: data.location.country,
      region: data.location.region,
      hora_local: data.location.localtime,
      pronostico: data.forecast.forecastday.map(day => ({
        fecha: day.date,
        temperatura_max: day.day.maxtemp_c,
        temperatura_min: day.day.mintemp_c,
        descripcion: day.day.condition.text,
        icono: day.day.condition.icon,
        probabilidad_lluvia: day.day.daily_chance_of_rain,
        humedad: day.day.avghumidity,
        velocidad_viento: day.day.maxwind_kph
      }))
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('API key inválida para WeatherAPI.com');
    }
    if (error.response?.status === 400) {
      throw new Error('Ciudad no encontrada');
    }
    throw new Error(`Error al obtener pronóstico: ${error.message}`);
  }
};
