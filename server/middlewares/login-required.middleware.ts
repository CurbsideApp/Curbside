import { NextFunction, Request, Response } from 'express';
import { USER_NOT_AUTHENTICATED } from '../errors/SharedErrorMessages';

export const loginRequired = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // @ts-ignore
  if (req.user) {
    next();
  } else {
    res.status(401).send({ error: USER_NOT_AUTHENTICATED });
  }
};
