import { getWeatherByCity, getWeatherByLocation, getWeatherForecast } from "../services/weatherService.js";

async function routes(fastify, options) {
  const { apiCounters } = options;
  
  // Obtener clima por ciudad
  fastify.get("/city", async (request, reply) => {
    // Incrementar contador
    if (apiCounters) {
      apiCounters.incrementEndpoint('city');
      fastify.log.info(`🌍 Consulta a /weather/city - Total: ${apiCounters.totalRequests}`);
    }
    
    const { city } = request.query;

    if (!city) {
      return reply.code(400).send({ 
        error: "Parámetro requerido", 
        message: "El parámetro 'city' es obligatorio" 
      });
    }

    try {
      const data = await getWeatherByCity(city);
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ 
        error: "Error del servidor", 
        message: error.message 
      });
    }
  });

  // Obtener clima por ubicación (coordenadas)
  fastify.get("/location", async (request, reply) => {
    const { lat, lon } = request.query;

    if (!lat || !lon) {
      return reply.code(400).send({ 
        error: "Parámetros requeridos", 
        message: "Los parámetros 'lat' y 'lon' son obligatorios" 
      });
    }

    // Validar que lat y lon sean números válidos
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return reply.code(400).send({ 
        error: "Parámetros inválidos", 
        message: "Latitud y longitud deben ser números válidos" 
      });
    }

    if (latitude < -90 || latitude > 90) {
      return reply.code(400).send({ 
        error: "Latitud inválida", 
        message: "La latitud debe estar entre -90 y 90" 
      });
    }

    if (longitude < -180 || longitude > 180) {
      return reply.code(400).send({ 
        error: "Longitud inválida", 
        message: "La longitud debe estar entre -180 y 180" 
      });
    }

    try {
      const data = await getWeatherByLocation(latitude, longitude);
      
      // Incrementar contador
      if (apiCounters) {
        apiCounters.incrementEndpoint('location');
        fastify.log.info(`📍 Consulta a /weather/location - Total: ${apiCounters.totalRequests}`);
      }
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ 
        error: "Error del servidor", 
        message: error.message 
      });
    }
  });

  // Obtener pronóstico del clima
  fastify.get("/forecast", async (request, reply) => {
    const { city, days = 14 } = request.query;

    if (!city) {
      return reply.code(400).send({ 
        error: "Parámetro requerido", 
        message: "El parámetro 'city' es obligatorio" 
      });
    }

    const daysNum = parseInt(days);
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 14) {
      return reply.code(400).send({ 
        error: "Parámetro inválido", 
        message: "El parámetro 'days' debe ser un número entre 1 y 14" 
      });
    }

    try {
      const data = await getWeatherForecast(city, daysNum);
      
      // Incrementar contador
      if (apiCounters) {
        apiCounters.incrementEndpoint('forecast');
        fastify.log.info(`🌤️ Consulta a /weather/forecast - Total: ${apiCounters.totalRequests}`);
      }
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ 
        error: "Error del servidor", 
        message: error.message 
      });
    }
  });

  // Endpoint principal con información de la API
  fastify.get("/", async (request, reply) => {
    return {
      message: "Weather API - WeatherAPI.com Integration",
      version: "1.0.0",
      endpoints: {
        "GET /city?city={nombre_ciudad}": "Obtener clima actual por ciudad",
        "GET /location?lat={latitud}&lon={longitud}": "Obtener clima actual por coordenadas",
        "GET /forecast?city={nombre_ciudad}&days={dias}": "Obtener pronóstico del clima (1-14 días)"
      },
      timestamp: new Date().toISOString()
    };
  });
}

export default routes;
