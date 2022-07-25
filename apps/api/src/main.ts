import "utils/env";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import connectRedis from "connect-redis";
import session from "express-session";
import ms from "ms";

import { ApiModule } from "./api.module";
import { redisClient } from "./utils";

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  // * Session & redis
  const RedisStore = connectRedis(session);

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redisClient,
    }),
    name: "iid",
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // TODO : Dès que le serveur prod est en HTTPS -> secure: process.env.NODE_ENV === "production",
      secure: false,
      maxAge: ms("7y"),
      // TODO : Dès que le serveur prod est en HTTPS -> sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      sameSite: "lax",
    },
  };

  app.use(session(sessionOption));

  useContainer(app.select(ApiModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.API_PORT || 3001);
}

bootstrap();
