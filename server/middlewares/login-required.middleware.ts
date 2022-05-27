import { NextFunction, Request, Response } from 'express';
import { USER_NOT_AUTHENTICATED, USER_NOT_FINALIZED } from '../errors/SharedErrorMessages';
import { prisma } from '../prisma/client';
import { getUserById } from '../queries/user.queries';

export const fullUserRequired = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // @ts-ignore
  if (req.user) {
    // @ts-ignore
    const dbUser = await getUserById(req.user.uid);
    if (!dbUser) {
      prisma.user.create({
        data: {
          // @ts-ignore
          id: req.user.uid,
          // @ts-ignore
          email: req.user.email,
          emailVerified: true
        }
      });

      res.status(400).send({ error: USER_NOT_FINALIZED });
    } else {
      next();
    }
  } else {
    res.status(401).send({ error: USER_NOT_AUTHENTICATED });
  }
};

export const loginRequired = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // @ts-ignore
  if (req.user) {
    next();
  } else {
    res.status(401).send({ error: USER_NOT_AUTHENTICATED });
  }
};
