import '../styling/ListingPreview.scss';
import { memo } from 'react';

export default memo(function ListingPreview({ listing }: { [key: string]: any }) {
  const price = (listing.priceInCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
  return (
    <div className="ListingPreview">
      <div className="card-product-image-holder">
        <img
          src={listing.photoUrls[0]}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = require('../assets/empty-leaf.png');
          }}
          alt={listing.title}
        />
      </div>
      <div className="card-product-info">
        <p className="product-info-price">{price}</p>
        <p className="product-info-title max-two-lines">{listing.title}</p>
        <p className="product-info-description max-three-lines">{listing.description}</p>
      </div>
    </div>
  );
});
