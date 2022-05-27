import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styling/SimpleMap.scss'


const SimpleMap = ({position, radius}: {position: {lat: number, lng: number}, radius: number}) => {

  return (
    <section className='SimpleMap' >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '200px', width: '100%' }}
      >
        {radius && <Circle center={[position.lat, position.lng]} radius={radius * 1000 || 10000} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
       
      </MapContainer>
    </section>
  )
}

export default SimpleMap