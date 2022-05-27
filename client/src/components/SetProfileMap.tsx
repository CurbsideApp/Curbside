import React from 'react'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import SetProfileMapLayers from './SetProfileMapLayers';

import 'leaflet/dist/leaflet.css';

function Map({ position, setPosition, radius, zoom }: mapSetUp) {

  function ChangeView({ center, zoom }:{ center:{lat: number, lng: number}, zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <section className='map-component' >
      {/* --- (5) Add leaflet map container --- */}
      <div className='map' id='map' >
        {/* @ts-ignore:next-line */}
        <MapContainer
          center={[position.lat, position.lng]}
          scrollWheelZoom={true}
          style={{ height: '300px', width: '100%' }}
        >
          {radius && <Circle center={[position?.lat, position?.lng]} radius={radius * 1000 || 10000} />}
          <ChangeView center={position} zoom={zoom || 9} />
          <TileLayer
            // @ts-ignore:next-line
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <SetProfileMapLayers position={position} setPosition={setPosition} />
        </MapContainer>
        {/* --- ---------------------------- --- */}
      </div>
    </section>
  )
}

interface mapSetUp {
  position: { lat: number, lng: number },
  setPosition: any,
  radius?: number,
  zoom?: number
}

export default Map