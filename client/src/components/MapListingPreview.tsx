import React from 'react';
import { Listing } from '../interfaces/Listing';
import { Link } from 'react-router-dom';
import '../styling/MapListingPreview.scss';
import xBtn from '../assets/x-symbol.svg';
import { useAuth } from '../contexts/AuthContext';
import emptyLeaf from '../assets/empty-leaf.png'

function MapListingPreview({
  activeListing,
  setActiveListing,
}: {
  activeListing: Listing;
  setActiveListing: React.Dispatch<React.SetStateAction<Listing | null | undefined>>;
}) {
  const price = (activeListing.priceInCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
  const { currentUser } = useAuth();
  return (
    <div className={`Card-Listing-Preview ${currentUser && 'with-user'}`}>
      <div
        className="closeBtn"
        onClickCapture={() => {
          setActiveListing(null);
        }}
      >
        <img src={xBtn} alt="close" className="xBtnIcon"></img>
      </div>
      <Link className="link-element" to={`/listing/${activeListing.id}`}>
        <div className="Preview-Image-Container">
          <img 
            className="Preview-Img" 
            alt={'item for sale'} 
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = emptyLeaf;
            }}
            src={activeListing.photoUrls[0]} />
        </div>
        <div className="Preview-Text-Content">
          <h6>{activeListing.title}</h6>
          <div className="Preview-Price-Listing-Container">
            <div className="Preview-Price">{price}</div>
            <div className="Preview-Rating">
              {activeListing.rating ? activeListing.rating : 'New'}
              <i className="bi bi-star-fill"></i>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default React.memo(MapListingPreview);
