import { NextFunction, Request, Response } from 'express';
import { ProfileDTO } from '../interfaces/profile.interface.dto';
import { FinalizeUserDTO, InitialUserDTO } from '../interfaces/users.interface.dto';
import usersModel from '../models/users.model';

const addInitialUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDetails: InitialUserDTO = req.body;
    const user = await usersModel.addInitialUser(userDetails);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

const finalizeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDetails: FinalizeUserDTO = req.body;
    const userId: string = req.params.id;
    const user = await usersModel.finalizeUser(userId, userDetails);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    // @ts-ignore
    const { user, listings }: ProfileDTO = await usersModel.getUser(req.user?.uid, userId);
    res.status(200).send({ user, listings });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserProfile,
  addInitialUser,
  finalizeUser
};
