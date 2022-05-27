import { CustomError } from '../../errors/CustomError.class';
import { CustomErrorMessageObject } from '../../errors/CustomErrorMessageObject.interface';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { prisma } from '../../prisma/client';
import { coordinationVerification } from './user.model.validation';

export const listingsModelErrorMessages = {
  invalidTitle: 'Invalid title.',
  invalidDescription: 'Invalid description.',
  invalidPrice: 'Invalid price.',
  invalidPhotos: 'Please add at least one valid photo.',
  invalidCoordinate: 'Invalid location coordinates.',
  userNotFound: 'The user associated with this listing has not been found.'
};

export const addListingInputValidation = async (listingDetails: AddListingDTO): Promise<void> => {
  const errorMessages: CustomErrorMessageObject = {};

  if (typeof listingDetails.title !== 'string' || listingDetails.title.trim().length < 1 || listingDetails.title.trim().length > 100) {
    errorMessages.title = listingsModelErrorMessages.invalidTitle;
  }
  if (typeof listingDetails.description !== 'string' || listingDetails.description.trim().length < 1 || listingDetails.description.trim().length > 500) {
    errorMessages.description = listingsModelErrorMessages.invalidDescription;
  }
  if (typeof listingDetails.priceInCents !== 'number' || listingDetails.priceInCents < 0 || listingDetails.priceInCents > 10000000) {
    errorMessages.priceInCents = listingsModelErrorMessages.invalidPrice;
  }
  if (listingDetails.photoUrls === undefined || listingDetails.photoUrls.length === 0) {
    errorMessages.photoUrls = listingsModelErrorMessages.invalidPhotos;
  }
  if (!coordinationVerification(listingDetails.longitude)) {
    errorMessages.longitude = listingsModelErrorMessages.invalidCoordinate;
  }
  if (!coordinationVerification(listingDetails.latitude)) {
    errorMessages.latitude = listingsModelErrorMessages.invalidCoordinate;
  }
  const user = await prisma.user.findUnique({ where: { id: listingDetails.userId } });
  if (!user) {
    errorMessages.user = listingsModelErrorMessages.userNotFound;
  }
  if (Object.keys(errorMessages).length) {
    throw new CustomError(JSON.stringify(errorMessages), 400);
  }
};
