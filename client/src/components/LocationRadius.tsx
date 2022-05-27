import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, InputGroup, FormControl } from 'react-bootstrap';
import InputField from './InputField';
import Button from 'react-bootstrap/Button';
import Map from './SetProfileMap';
import Slider from '@mui/material/Slider';
import {ApiResponse} from '../interfaces/LocationApiResponse';
import '../styling/FiltersComponents.css'

export default function LocationRadius({
  locationIsVisible,
  closeLocationModal,
  applyLocation,
  locationGroupField,
  setLocationGroupField
}: { [key: string]: any }) {

  const urlSearch = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  const [radius, setRadius] = useState<number >(locationGroupField.radius);
  const [position, setPosition] = useState<{ lat: number , lng: number }>({ lat: locationGroupField.latitude, lng: locationGroupField.longitude });
  const [locationResult, setLocationResult] = useState<{ location: string | undefined, lat: string | undefined, lng: string | undefined }>({location: undefined, lat: undefined, lng: undefined}); // location: undefined, lat: undefined, lng: undefined
  const [clickPosition, setClickPosition] = useState<{ lat: number | undefined, lng: number | undefined }>({lat: undefined, lng: undefined}); //lat: undefined, lng: undefined
  const [address, setAddress] = useState<string>(locationGroupField.address);
  
  useEffect(() => {
    if (clickPosition && clickPosition?.lat) {
      const response = () => {
        const latCopy = clickPosition.lat!.toString();
        const lngCopy = clickPosition.lng!.toString();
        const positionLessAccurate = [
          latCopy?.slice(0, latCopy?.indexOf('.') + 5),
          lngCopy?.slice(0, lngCopy?.indexOf('.') + 5)
        ];
        fetch(urlSearch + positionLessAccurate.join(','))
          .then(res => res.json())
          .then(res => formatResponse(res))
          .then(res => (
            setAddress(res.display_name)
          ))
          .then(() => {
            setPosition({lat: parseFloat(latCopy), lng: parseFloat(lngCopy)})
          });
      };
      response();
    }
  }, [clickPosition])

  useEffect(() => {
    if (locationResult.lat && locationResult?.lng) {
      setPosition({ lat: parseFloat(locationResult?.lat), lng: parseFloat(locationResult?.lng) });
    }
  }, [locationResult]);

  useEffect(() => {
    setPosition({ lat: locationGroupField.latitude, lng: locationGroupField.longitude });
    setAddress(locationGroupField.address)
    // if (booleanCheckApplyFilters) {
    //   applyFilters()
    // }
    // booleanCheckApplyFilters.current = false;
  }, [locationGroupField])

  function pressEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && address) {
      getCityInformation(address)
    }
  }

  async function getCityInformation(query: string | undefined) {
    const selectedPlace = await fetch(urlSearch + query)
      .then(res => res.json())
      .then(res => formatResponse(res))
      .then(res => {
        setLocationResult({
          location: res.display_name,
          lat: res.lat,
          lng: res.lon
        })
      })
  }

  function formatResponse(response: ApiResponse[]) {
    let selectedPlace = response.filter(el => (el.type === 'city' || el.type === 'village'))[0];
    if (!selectedPlace) {
      selectedPlace = response[0];
    }
    return selectedPlace;
  }

  function saveAndClose() {
    applyLocation({
      latitude: position.lat,
      longitude: position.lng,
      radius: radius,
      address: address,
    })
    // booleanCheckApplyFilters.current = true;
  }

  return (
    <Modal show={locationIsVisible} onHide={closeLocationModal}>
      <Modal.Header closeButton>Location & Radius</Modal.Header>
      <Modal.Body className="filter-frame" >
        <InputField
          name="location"
          label='Location'
          type='location'
          placeholder='Search...'
          value={address}
          onChange={(e: any): void => setAddress(e.target.value ? e.target.value[0].toUpperCase() + e.target.value.slice(1) : "")}
          onKeyPress={(e: any) => pressEnter(e)}
        />
        <Form style={{ display: "flex", justifyContent: 'space-between', width: "100%", gap: '10px' }}>
          <div style={{ width: 'calc(100% - 110px - 20px)' }}>
            <Slider
              sx={{
                color: '#357960',
              }}
              value={radius}
              defaultValue={10}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={(e) => {
                setRadius(parseInt((e.target as HTMLInputElement).value, 10) < 1 ? 1 : parseInt((e.target as HTMLInputElement).value, 10))
              }}
            />
          </div>
          <div style={{ minWidth: "100px" }}>
            <InputGroup >
              <FormControl
                style={{ width: '30px' }}
                value={radius || ""}
                onChange={e => setRadius(e.target.value ? parseInt(e.target.value, 10) : 0)}
                // onChange={e => setRadius((parseInt(e.target.value, 10) < 1 || e.target.value === "") ? 1 : parseInt(e.target.value, 10))}
              />
              <InputGroup.Text style={{ width: '50px', marginRight: '0' }} id="basic-addon2">km</InputGroup.Text>
            </InputGroup>
          </div>
        </Form>
        {position?.lat && position?.lng && <Map position={position} setPosition={setClickPosition} radius={radius} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={saveAndClose}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}
// interface ApiResponse {
//   "place_id": number,
//   "licence": string,
//   "osm_type": string,
//   "osm_id": number,
//   "boundingbox": string[],
//   "lat": string,
//   "lon": string,
//   "display_name": string,
//   "class": string,
//   "type": string,
//   "importance": number,
//   "icon": string
// }