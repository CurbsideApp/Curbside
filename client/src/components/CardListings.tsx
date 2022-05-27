import React, { useState, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../interfaces/Listing';
import ListingPreview from './ListingPreview';
import '../styling/CardListings.scss';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiProvider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmptyState from './EmptyState';
// @ts-ignore
import('leaflet.markercluster/dist/leaflet.markercluster.js');
// @ts-ignore
import('leaflet.markercluster/dist/MarkerCluster.css');
// @ts-ignore
import('leaflet.markercluster/dist/MarkerCluster.Default.css');

interface cardArguments {
  listings: Listing[];
  isLoading: boolean;
  loadingError?: boolean;
  favoriteList: Listing[];
  setFavoriteList: React.Dispatch<SetStateAction<Listing[]>>;
}

function CardListings({ listings, isLoading, loadingError, favoriteList, setFavoriteList }: cardArguments) {
  const { currentUser } = useAuth();
  const api = useApi();
  async function heartToggle(listingId: string) {
      if (favoriteList.filter((element) => element.id === listingId).length === 1) {
        const response = await api.delete(`/favorites`, { favoriteId: listingId });
        if (!response.ok) {
          return;
        }
        setFavoriteList((prev) => prev.filter((listing) => listing.id !== listingId));
      } else {
        const response = await api.patch(`/favorites`, { favoriteId: listingId });
        if (!response.ok) {
          return;
        }
        setFavoriteList((prev) => [...prev, listings.filter((listing) => listing.id === listingId)[0]]);
      }
  }

  const listings4Display = listings.map((listing) => {
    return (
      <div className="listing-preview" key={listing.id}>
        {favoriteList && favoriteList.filter((element) => element.id === listing.id).length === 1
          ? currentUser && (
              <div className="heart-wrapper" onClick={() => heartToggle(listing.id)}>
                <FavoriteIcon fontSize="medium" htmlColor="rgba(255, 66, 66, 1)"></FavoriteIcon>
              </div>
            )
          : currentUser && (
              <div className="heart-wrapper" onClick={() => heartToggle(listing.id)}>
                <FavoriteBorderIcon fontSize="medium" htmlColor="rgba(255,255,255,1)"></FavoriteBorderIcon>
              </div>
            )}
        <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <ListingPreview listing={listing} />
        </Link>
      </div>
    );
  });

  return (
    <div className="CardListings">
      {listings4Display}
      {!isLoading && listings && listings.length === 0 && <EmptyState text="No listings"/>}
      {/* {loadingError && <EmptyState text="Couldn't load listings"/> } */}
    </div>
  );
}

export default CardListings;
