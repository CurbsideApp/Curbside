import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { Listing } from '../interfaces/Listing';
import * as L from 'leaflet';
import ReactDOM from 'react-dom';
import 'leaflet.markercluster';
import MapListingPreview from './MapListingPreview';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default function MapListings({
  listings,
  position,
  activeListing,
  setActiveListing,
}: {
  listings: Listing[];
  position: { latitude: number; longitude: number };
  activeListing: Listing | null | undefined;
  setActiveListing: React.Dispatch<React.SetStateAction<Listing | null | undefined>>;
}) {
  const map = useRef<L.Map>();
  const clusterLayer = useRef<L.MarkerClusterGroup>();

  useEffect(() => {
    clusterLayer.current?.remove();

    if (!map.current) {
      return;
    }

    if (clusterLayer && clusterLayer.current) {
      map.current.removeLayer(clusterLayer.current);
      clusterLayer.current?.remove();
    }

    clusterLayer.current = L.markerClusterGroup();

    listings.forEach((listing) => {
      let oneMarker = L.circleMarker(L.latLng(listing.latitude, listing.longitude), { radius: 10, color: 'green' });
      //@ts-ignore
      oneMarker.options['id'] = listing.id;
      oneMarker.addTo(clusterLayer.current!);
      oneMarker.on('click', () => {
        let clickedListing = listings.find((l) => l.id === listing.id);
        setActiveListing(clickedListing);
        if (clickedListing?.id === listing.id) {
          oneMarker.setStyle({ color: '#357960' });
        }
      });
    });

    map.current.addLayer(clusterLayer.current);
  }, [listings, setActiveListing]);

  useEffect(() => {
    const mapNode = ReactDOM.findDOMNode(document.getElementById('mapId')) as HTMLDivElement;

    if (!mapNode || map.current) {
      return;
    }

    map.current = L.map(mapNode).setZoom(9).setView(L.latLng(position.latitude, position.longitude));

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 17 }).addTo(
      map.current
    );
  }, [position.latitude, position.longitude]);

  return (
    <div className="map-set-height">
      <div style={{ flexGrow: '1', zIndex: '0', position: 'relative' }} id="mapId"></div>
      {activeListing ?
        <MapListingPreview
          activeListing={activeListing}
          setActiveListing={setActiveListing}
        />
        :
        null
      }
    </div>
  );
}
