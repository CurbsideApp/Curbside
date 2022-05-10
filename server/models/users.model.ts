import { CustomError } from '../errors/CustomError.class';
import { UNKNOWN_SERVER_ERROR } from '../errors/SharedErrorMessages';
import { ProfileDTO } from '../interfaces/profile.interface.dto';
import { IUser } from '../interfaces/user.interface';
import { FinalizeUserDTO, InitialUserDTO } from '../interfaces/users.interface.dto';
import userQueries from '../queries/userQueries';
import { addInitialUserInputValidation, finalizeUserInputValidation } from './users.model.validation';

const addInitialUser = async (userDetails: InitialUserDTO): Promise<IUser> => {
  try {
    await addInitialUserInputValidation(userDetails);
    const user: IUser = await userQueries.createInitialUser(userDetails);
    return user;
  } catch (error) {
    console.log('/models/users.model addInitialUser ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};

const finalizeUser = async (userId: string, userDetails: FinalizeUserDTO): Promise<IUser> => {
  try {
    await finalizeUserInputValidation(userId, userDetails);
    const user: IUser = await userQueries.finalizeUser(userId, userDetails);
    return user;
  } catch (error) {
    console.log('/models/users.model finalizeUser ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};

const getUser = async (requesterId: string | undefined, userId: string): Promise<ProfileDTO> => {
  try {
    if (requesterId === userId) {
      // if request is authenticated and is  the owner of the account
      // then return all data
      const data = await userQueries.getOwnProfile(userId);
      return data;
    } else {
      const data = await userQueries.getForeignProfile(userId);
      return data;
    }
  } catch (error) {
    console.log('/models/users.model getUser ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};

export default {
  addInitialUser,
  finalizeUser,
  getUser
};
