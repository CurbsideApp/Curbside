import "@testing-library/jest-dom";
import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
  act
} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import HomeComponent from "../components/HomeComponent";

const mockGet = require("jest-mock").fn(async () => {
  return {
    ok: true,
    status: 200,
    body: {
      data: {
        listings: [
          {
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
          },
          {
            condition: "gentlyUsed",
            createdAt: "2021-10-08T09:24:18.000Z",
            currency: "eur",
            description: "This is my desk",
            id: "2",
            latitude: 52.72,
            longitude: 13.038,
            photoUrls: [],
            priceInCents: 5000,
            rating: null,
            status: 'available',
            tags: "Appliances",
            userId: "22",
            title: "Desk",
          },
          {
            condition: "used",
            createdAt: "2021-10-08T09:24:18.000Z",
            currency: "eur",
            description: "This is my chair",
            id: "3",
            latitude: 52.92,
            longitude: 13.038,
            photoUrls: [],
            priceInCents: 1000,
            rating: null,
            status: 'available',
            tags: "Appliances",
            userId: "33",
            title: "Chair",
          },
        ],
        offset: 3,
      },
    },
  };
});

jest.mock('react-leaflet', () => {});
jest.mock('react-router-dom', () => {
  return {Link: {}}
});

jest.mock('../components/CardListings')




jest.mock("../contexts/ApiProvider", () => {
  return {
    useApi: () => {
      const api = {
        get: mockGet,
      };
      return api;
    },
  };
});
jest.mock('../contexts/AuthContext', () => {
  return {
    useAuth: () => {
      const currentUser = null //{ 
        // id: "1", 
      // } 
      return { currentUser } 
    }
  }
})

describe("Home View Component", () => {
  it.only("should display home view elements", async () => {
      render(<HomeComponent />);
      await waitFor(() => {
        screen.getByPlaceholderText("Search...");
        screen.getByText("Berlin");
        screen.getByText("Filter");
      });
  });
});
