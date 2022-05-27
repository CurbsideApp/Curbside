import React from 'react';
import '../styling/Header.scss';
import { useNavigate } from 'react-router-dom';
import { listingChatPreview } from '../interfaces/Listing';

export default function ChatHeader({ listing }: HeaderProps) {
  const navigate = useNavigate();
  const photoUrl = listing.photoUrls[0];
  const sellerName = `${listing.userFirstName} ${listing.userLastName[0]}.`;
  const price = (listing.priceInCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
  function PrevRoute() {
    return (
      <button className="PrevRoute" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
    );
  }
  return (
    <div className="Header ChatHeader">
      <PrevRoute />
      <div className="listingImage" style={{ backgroundImage: `url("${photoUrl}")` }}></div>
      <div className="listingInfo">
        <p className="listingTitle">{listing.title}</p>
        <p className="listingPrice">{price}</p>
      </div>
      <p className="sellerName">{sellerName}</p>
    </div>
  );
}

interface HeaderProps {
  listing: listingChatPreview;
}
