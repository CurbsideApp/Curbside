import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddListingForm from '../components/AddListingForm';

const mockGet = require('jest-mock').fn(async () => {
  return { ok: true, body: { data: { user: { latitude: 13.13, longitude: 30.3 } } } };
});

const mockPost = require('jest-mock')
  .fn()
  .mockImplementation(async (url, body) => {
    return { ok: true };
  });

jest.mock('browser-image-compression', () => {
  return () => '';
});
jest.mock('heic2any', () => {
  return () => ({});
});

jest.mock('../contexts/ApiProvider', () => {
  return {
    useApi: () => {
      const api = {
        get: mockGet,
        post: mockPost,
      };
      return api;
    },
  };
});

jest.mock('firebase/storage', () => {
  return {
    ref: (storage, title) => 'imageRefOnFB',
    uploadBytes: (imageRef, file) => undefined,
    getDownloadURL: (imageref) => 'www.imageurl.com',
  };
});

jest.mock('../firebase', () => {
  return {
    storage: () => {},
    auth: () => {},
  };
});

jest.mock('../contexts/AuthContext', () => {
  return {
    useAuth: () => {
      const currentUser = {
        id: '1',
      };
      return { currentUser };
    },
  };
});

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => {
      const navigate = () => {};
      return navigate;
    },
  };
});

describe.only('Add Listing Form', () => {
  console.log('running add listing form test')
  it('loads and displays Add Listing View', async () => {
    render(<AddListingForm />);

    await waitFor(() => {
      screen.getByLabelText('Title');
      screen.getByLabelText('Price');
      screen.getByLabelText('Condition');
      screen.getByLabelText('Description');
      screen.getByLabelText('Photos');
      screen.getByLabelText('Categories');
      screen.getAllByRole('button');
    });
  });

  it('displays errors when missing info', async () => {
    const user = userEvent.setup();
    render(<AddListingForm />);
    await waitForElementToBeRemoved(() => screen.queryByAltText('spinner'));

    const title = screen.getByLabelText(/title/i);
    const price = screen.getByLabelText(/price/i);
    const condition = screen.getByLabelText(/condition/i);
    const categories = screen.getByLabelText(/categories/i);
    const description = screen.getByLabelText(/description/i);
    const photos = screen.getByLabelText(/photos/i);
    const submit = screen.getByRole('button', { name: /create/i });

    await user.click(submit);

    expect(screen.getByText(/Title is required/i)).toBeTruthy();
    expect(screen.getByText(/Price is required/i)).toBeTruthy();
    expect(screen.getByText(/Description is required/i)).toBeTruthy();
    expect(screen.getByText(/Please upload at least one photo/i)).toBeTruthy();
    expect(screen.getByText(/Please add at least one category/i)).toBeTruthy();

    await user.type(title, 'Awesome Sauce');
    await user.click(submit);

    expect(() => screen.getByText(/Title is required/i)).toThrowError(
      'Unable to find an element with the text: /Title is required/i'
    );

    await user.type(categories, 'moto');
    const option = screen.getByText('Motorbikes');
    await user.click(option);
    await user.click(submit);

    expect(() => screen.getByText(/Please add at least one category/i)).toThrowError(
      'Unable to find an element with the text: /Please add at least one category/i'
    );

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    await user.upload(photos, file);
    await user.click(submit);

    expect(() => screen.getByText(/Please upload at least one photo/i)).toThrowError(
      'Unable to find an element with the text: /Please upload at least one photo/i'
    );
  });

  it('passes the correct query to the api', async () => {
    const user = userEvent.setup();
    render(<AddListingForm />);
    await waitForElementToBeRemoved(() => screen.queryByAltText('spinner'));

    const title = screen.getByLabelText(/title/i);
    const price = screen.getByLabelText(/price/i);
    const condition = screen.getByLabelText(/condition/i);
    const categories = screen.getByLabelText(/categories/i);
    const description = screen.getByLabelText(/description/i);
    const photos = screen.getByLabelText(/photos/i);
    const submit = screen.getByRole('button', { name: /create/i });

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    await userEvent.upload(photos, file);

    await user.type(title, 'A new thing');
    await user.type(price, '42.34');
    await user.type(description, 'The Coolest new thing');
    await user.selectOptions(condition, screen.getAllByRole('option', { name: 'Gently Used' }));
    await user.type(categories, 'moto');
    const option = screen.getByText('Motorbikes');
    await user.click(option);

    await user.click(submit);
    expect(() => screen.getByText(/Title is required/i)).toThrowError(
      'Unable to find an element with the text: /Title is required/i'
    );
    expect(() => screen.getByText(/Price is required/i)).toThrowError(
      'Unable to find an element with the text: /Price is required/i'
    );
    expect(() => screen.getByText(/Description is required/i)).toThrowError(
      'Unable to find an element with the text: /Description is required/i'
    );
    expect(() => screen.getByText(/Please upload at least one photo/i)).toThrowError(
      'Unable to find an element with the text: /Please upload at least one photo/i'
    );
    expect(() => screen.getByText(/Please add at least one category/i)).toThrowError(
      'Unable to find an element with the text: /Please add at least one category/i'
    );

    const url = '/listings';
    const body = {
      userId: '1',
      currency: 'eur',
      photoUrls: ['www.imageurl.com'],
      latitude: 13.13,
      longitude: 30.3,
      title: 'A new thing',
      description: 'The Coolest new thing',
      condition: 'gentlyUsed',
      priceInCents: 4234,
      tags: 'Motorbikes',
    };
    expect(mockPost).toBeCalledTimes(1);
    expect(mockPost).toBeCalledWith(url, body);
  });
});
