import { Request, Response } from "express";
import { Session } from "express-session";

import { User } from "database/prisma";

export interface IshiroContext {
  req: Request & {
    session: Session & {
      user?: User;
    };
  };
  res: Response;
}
