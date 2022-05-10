// @ts-nocheck
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import SetProfileMapLayers from './SetProfileMapLayers';

// import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({position, setPosition}) {


  return (
    <section className='map-component' >
      {/* --- (5) Add leaflet map container --- */}
      <div className='map' id='map' >
      {/* @ts-ignore:next-line */}
      <MapContainer
        center={{lng:13.38, lat:52.51}}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '300px', width: '100%' }}
      >
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

export default Map