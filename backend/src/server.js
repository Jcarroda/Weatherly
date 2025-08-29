import Fastify from "fastify";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weather.js";
import authPlugin from "../plugins/auth.js";

dotenv.config();

const app = Fastify({ logger: true });

// Sistema de contadores globales
const apiCounters = {
  totalRequests: 0,
  weatherCity: 0,
  weatherLocation: 0,
  weatherForecast: 0,
  lastReset: new Date().toISOString(),
  
  // Incrementar contador total
  incrementTotal() {
    this.totalRequests++;
  },
  
  // Incrementar contador específico
  incrementEndpoint(endpoint) {
    switch(endpoint) {
      case 'city':
        this.weatherCity++;
        break;
      case 'location':
        this.weatherLocation++;
        break;
      case 'forecast':
        this.weatherForecast++;
        break;
    }
    this.incrementTotal();
  },
  
  // Obtener estadísticas
  getStats() {
    return {
      totalRequests: this.totalRequests,
      endpoints: {
        weatherCity: this.weatherCity,
        weatherLocation: this.weatherLocation,
        weatherForecast: this.weatherForecast
      },
      lastReset: this.lastReset,
      timestamp: new Date().toISOString()
    };
  },
  
  // Resetear contadores
  reset() {
    this.totalRequests = 0;
    this.weatherCity = 0;
    this.weatherLocation = 0;
    this.weatherForecast = 0;
    this.lastReset = new Date().toISOString();
  }
};

// Registrar middleware de autenticación
app.register(authPlugin);

// Ruta raíz
app.get("/", async (request, reply) => {
  return {
    message: "Weather API Gateway",
    version: "1.0.0",
    status: "running",
    endpoints: {
      weather: "/weather",
      health: "/health"
    },
    timestamp: new Date().toISOString()
  };
});

// Ruta de salud
app.get("/health", async (request, reply) => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString()
  };
});

// Ruta de estadísticas de la API
app.get("/stats", async (request, reply) => {
  return apiCounters.getStats();
});

// Ruta para resetear contadores (solo en desarrollo)
app.post("/stats/reset", async (request, reply) => {
  if (process.env.NODE_ENV === 'production') {
    return reply.code(403).send({ error: 'Reset no permitido en producción' });
  }
  
  apiCounters.reset();
  return {
    message: "Contadores reseteados",
    timestamp: new Date().toISOString()
  };
});

// Registrar rutas con acceso a los contadores
app.register(weatherRoutes, { prefix: "/weather", apiCounters });

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

