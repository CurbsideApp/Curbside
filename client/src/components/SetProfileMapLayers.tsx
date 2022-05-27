import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import { Icon } from 'leaflet';

function SetProfileMapLayers({position, setPosition}: {position: {lat: number, lng: number}, setPosition: React.Dispatch<React.SetStateAction<{lat: number, lng: number}>> }) {
  // const [position, setPosition] = useState({lng:13.38, lat:52.51})
  const customIcon = new Icon({
    iconUrl: "/icons8-select-24.png",
    iconSize: [17, 17]
  })

  const map = useMapEvents({
  click(e) {
    map.locate()
    setPosition(e.latlng);
    // console.log({position});
  }
    // map.flyTo(e.latlng, map.getZoom());
})

return (
  <Marker position={position} icon={customIcon}/>
)}

export default SetProfileMapLayers