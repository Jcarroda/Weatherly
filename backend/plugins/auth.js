export default async function authPlugin(fastify) {
    fastify.addHook("onRequest", async (request, reply) => {
        const apiKey = request.headers["x-api-key"];
        if (!apiKey || apiKey !== process.env.API_KEY_SECRETA) {
            return reply.code(401).send({ error: "No autorizado" });
        }
    });
}

