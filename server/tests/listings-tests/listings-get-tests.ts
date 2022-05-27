import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { ListingCondition } from '@prisma/client';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { IListing, IListingCondition } from '../../interfaces/listing.interface';
import distanceHelpers from '../../models/model-helpers/distance.helpers';

export const listingsGetTests = (): void => {
  describe('GET /listings', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: process.env.SECRET_UID!,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };

    let testToken: string|undefined;

    beforeAll(async () => {
      await prisma.user.create({ data: mockInitialUserInput });
      for (let i = 0; i < 50; i++) {
        await addRandomMockListing(process.env.SECRET_UID!, i % 2 !== 0);
      }
    });

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterAll(async () => {
      await prisma.listing.deleteMany();
      await prisma.user.deleteMany();
    });

    it('Should update the offset', async () => {
      const offset = 0;
      const { body } = await request(server)
        .get(`/api/listings?offset=${offset}&radius=10&minPrice=0&sortby=newest`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.listings.length).toBeTruthy();
      expect(body.data.offset).toBe(offset + body.data.listings.length);
    });

    it('Should sort listings by newest', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=newest')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.listings.length).toBeTruthy();
      const sortedListings = body.data.listings.slice()
        .sort((a: IListing, b: IListing) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      expect(sortedListings).toEqual(body.data.listings);
    });

    it('Should sort listings by closest', async () => {
      const coords = [52.52, 13.0405];
      const { body } = await request(server)
        .get(`/api/listings?offset=0&radius=100&minPrice=0&sortBy=closest&longitude=${coords[1]}&latitude=${coords[0]}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.listings.length).toBeTruthy();
      const sortedListings = body.data.listings.slice()
        .sort((a: IListing, b: IListing) => distanceHelpers.getDistance(coords, [a.latitude, a.longitude]) - distanceHelpers.getDistance(coords, [b.latitude, b.longitude]));
      expect(sortedListings).toEqual(body.data.listings);
    });

    it('Should sort listings by price asc', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+asc')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.listings.length).toBeTruthy();
      const sortedListings = body.data.listings.slice()
        .sort((a: IListing, b: IListing) => a.priceInCents - b.priceInCents);
      expect(sortedListings[0])
        .toEqual(body.data.listings[0]);
    });

    it('Should sort listings by price desc', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+desc')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.listings.length).toBeTruthy();
      const sortedListings = body.data.listings.slice()
        .sort((a: IListing, b: IListing) => b.priceInCents - a.priceInCents);
      expect(sortedListings).toEqual(body.data.listings);
    });

    it('Should filter by condition', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+desc&condition=new')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      const listings: IListing[] = body.data.listings;
      expect(listings.length).toBeTruthy();
      expect(listings.filter((listing: IListing) => listing.condition === IListingCondition.new).length).toEqual(listings.length);
    });

    it('Should filter by search term in title', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+desc&search=title')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      const listings: IListing[] = body.data.listings;
      expect(listings.length).toBeTruthy();
      expect(listings.length).toEqual(25);
    });

    it('Should filter by search term in description', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+desc&search=description')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      const listings: IListing[] = body.data.listings;
      expect(listings.length).toBeTruthy();
      expect(listings.length).toEqual(25);
    });

    it('Should filter by search term in title and description', async () => {
      const { body } = await request(server)
        .get('/api/listings?offset=0&radius=100&minPrice=0&sortBy=price+desc&search=description+title')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      const listings: IListing[] = body.data.listings;
      expect(listings.length).toBeTruthy();
      expect(listings.length).toEqual(25);
    });
  });
};

const addRandomMockListing = async (ownerId: string, odd: boolean): Promise<void> => {
  function getRandomArbitrary (min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  function getRandomInt (min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const input: AddListingDTO = {
    userId: ownerId,
    title: odd ? 'Car Parts' : 'Test Title',
    description: odd ? 'Bike chain' : 'Test Description',
    currency: 'eur',
    photoUrls: JSON.stringify([
      'https://secure.img1-ag.wfcdn.com/im/54089193/resize-h600-w600%5Ecompr-r85/1231/123110031/Daulton+20%27%27+Wide+Velvet+Side+Chair.jpg',
      'https://images.unsplash.com/photo-1611464908623-07f19927264e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Z3JlZW4lMjBjaGFpcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1571977796766-578d484a6c25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZW4lMjBjaGFpcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
    ]),
    priceInCents: getRandomInt(100, 10000),
    longitude: getRandomArbitrary(13.3, 13.5),
    latitude: getRandomArbitrary(52.4, 52.6),
    condition: [IListingCondition.gentlyUsed, IListingCondition.new, IListingCondition.used][getRandomInt(0, 3)],
    tags: 'car bike'
    // addTag
  };
  await prisma.listing.create({
    data: {
      ...input,
      condition: input.condition === IListingCondition.new
        ? ListingCondition.new
        : input.condition === IListingCondition.gentlyUsed
          ? ListingCondition.gentlyUsed
          : ListingCondition.used
    }
  });
};
