import React from 'react'
import { Link } from 'react-router-dom'
import { Listing } from '../interfaces/Listing'
import ListingPreview from './ListingPreview'
import loader from '../assets/loader.gif';

// @ts-ignore
import('leaflet.markercluster/dist/leaflet.markercluster.js')
// @ts-ignore
import('leaflet.markercluster/dist/MarkerCluster.css')
// @ts-ignore
import('leaflet.markercluster/dist/MarkerCluster.Default.css')


function CardListings({listings , isLoading,loadingError}:{listings:Listing[] , isLoading:boolean,loadingError:boolean}) {
  const listings4Display= listings.map(listing => {
    return (<Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: "none", color: "black" }}>
      <ListingPreview  listing={listing} />
    </Link>)
  })
  console.log("listings4Display", listings4Display)
  return (
    <div className='listings-container'>
        {listings4Display}
        {!isLoading && listings.length === 0 && <p>No listing matched your request...</p>}
        {loadingError && <p>Couldn't load listings :/</p>}
        {isLoading && <img style={{ height: '20vw', maxHeight: '200px', borderRadius: '20px' }} src={loader} alt="Loading..." />} 
    
    </div>
  )
}

export default CardListings