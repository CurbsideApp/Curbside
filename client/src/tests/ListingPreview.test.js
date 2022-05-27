import '@testing-library/jest-dom';
import { render, waitFor, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListingPreview from '../components/ListingPreview';

const listingExample = {
  condition: "new",
  createdAt: "2021-10-08T09:24:18.000Z",
  currency: "eur",
  description: "This is my phone",
  id: "1",
  latitude: 52.52,
  longitude: 13.038,
  photoUrls: [],
  priceInCents: 10000,
  rating: null,
  status: 'available',
  tags: "Appliances",
  userId: "11",
  title: "Phone",
};

describe('Create a card for listing', () => {
  it('Should display listing information', async () => {
    render(<ListingPreview listing={listingExample} />)

    await waitFor(()=> {
      screen.getByText('€100.00');
      screen.getByText('Phone');
      screen.getByText('This is my phone');
    })
  })
})