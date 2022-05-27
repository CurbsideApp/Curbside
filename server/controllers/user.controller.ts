import { NextFunction, Request, Response } from 'express';
import { ProfileDTO } from '../interfaces/profile.interface.dto';
import { FinalizeUserDTO, InitialUserDTO } from '../interfaces/user.interface.dto';
import userModel from '../models/user.model';

const addInitialUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDetails: InitialUserDTO = req.body;
    const user = await userModel.addInitialUser(userDetails);
    res.status(200).send({ data: { user } });
  } catch (error) {
    next(error);
  }
};

const finalizeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDetails: FinalizeUserDTO = req.body;
    const userId: string = req.params.id;
    const user = await userModel.finalizeUser(userId, userDetails);
    res.status(200).send({ data: { user } });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    // @ts-ignore
    const { user, listings }: ProfileDTO = await userModel.getUser(req.user?.uid, userId);
    res.status(200).send({ data: { user, listings } });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserProfile,
  addInitialUser,
  finalizeUser
};
