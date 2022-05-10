import { prisma } from '../prisma/client';
export const spatialQuery = async (longitude: number, latitude: number, radius:number): Promise<any> => {
  const rawQueryRes = await prisma.$queryRaw<{id: string}[]>`SELECT id FROM "Listing" WHERE ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} *1000)` as any;
  console.log('rawQueryRes', rawQueryRes);
  return rawQueryRes;
};

export const spatialQueryListings = async (spatialQueryRes: any): Promise<any> => {
  console.log('spatialQueryRes', spatialQueryRes);
  const dbListings = await prisma.listing.findMany({
    where: {
      id: {
        in: spatialQueryRes.map(({ id }: {id:string}) => id)
      }
    }
  });
  return dbListings;
};
