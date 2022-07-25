import Redis from "ioredis";

export const redisClient = new Redis();

redisClient.on("error", (error) => {
  console.error(error);
});
