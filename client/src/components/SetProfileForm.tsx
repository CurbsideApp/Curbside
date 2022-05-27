
import React, { FormEvent, useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import Map from '../components/SetProfileMap';
import { useNavigate } from 'react-router-dom';
import '../styling/SetProfileForm.scss';
import { User } from '../interfaces/User';
import {ApiResponse} from '../interfaces/LocationApiResponse';


export default function SetProfileForm() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<User>();
  const [position, setPosition] = useState<{ lat: number , lng: number }>({ lng: 13.405, lat: 52.52 })
  const [address, setAddress] = useState<string>("Berlin");
  const [clickPosition, setClickPosition] = useState<{ lat: number | undefined, lng: number | undefined }>({lat: undefined, lng: undefined}); //lat: undefined, lng: undefined

  const urlSearch = 'https://nominatim.openstreetmap.org/search?format=json&q=';


  const api = useApi();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const loadUserData = async () => {
      const res = await api.get(`/users/${currentUser!.id}`);
      if (res.ok) {
        setUser(res.body.data.user);
        if (res.body.data.user.longitude && res.body.data.user.latitude) {
          setPosition({ lng: res.body.data.user.longitude, lat: res.body.data.user.latitude })
          setClickPosition({ lng: res.body.data.user.longitude, lat: res.body.data.user.latitude })
        }
      } else {
        console.log("failing to load user listing data");
        navigate('/')
        // handleErrors
      }
    };
    loadUserData();
  }, [api, currentUser, navigate])

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = nameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const errors: { [key: string]: string } = {};

    if (!name) {
      errors.name = "Name must not be empty"
    }
    if (!lastName) {
      errors.lastName = "Last name must not be empty"
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }
    if (name && lastName) {
      const additionalUserInfo = {
        firstName: name,
        lastName: lastName,
        city: address,
        longitude: position.lng,
        latitude: position.lat
      };

      const res = await api.patch(`/users/${currentUser?.id}`, additionalUserInfo);
      if (res.ok) {
        navigate('/')
      } else {
        // Need to add notification to customer
        console.log('ERROR')
      }

    }
  }
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
        setAddress(res.display_name);
        setPosition({lat: parseFloat(res.lat), lng: parseFloat(res.lon)})
      })
  }
  function formatResponse(response: ApiResponse[]) {
    let selectedPlace = response.filter(el => (el.type === 'city' || el.type === 'village'))[0];
    if (!selectedPlace) {
      selectedPlace = response[0];
    }
    return selectedPlace;
  }

  return (
    <>
      {user &&
        <>
          <div className="SetProfileForm">
            <Card>
              <Card.Body>
                <h2 className="text-center mb-2">Profile Details</h2>
                <Form >
                  <InputField
                    name="name"
                    label='Name'
                    type='text'
                    defaultValue={user ? user.firstName : ''}
                    fieldref={nameRef}
                    error={formErrors.name}
                  />
                  <InputField
                    name="lastName"
                    label='Last Name'
                    type='text'
                    defaultValue={user ? user.lastName : ''}
                    fieldref={lastNameRef}
                    error={formErrors.lastName}
                  />
                  <InputField
                    name="location"
                    label='Location'
                    type='location'
                    placeholder='Search...'
                    value={address}
                    onChange={(e: any): void => setAddress(e.target.value ? e.target.value[0].toUpperCase() + e.target.value.slice(1) : "")}
                    onKeyPress={(e: any) => pressEnter(e)}
                  />
                  <p className='comment'>Click on the map to select your location</p>

                  <Map zoom={12} position={position} setPosition={setClickPosition} />

                  <p className='comment'>
                    This location will be used for the items you sell
                  </p>
                  <Button onClick={handleSubmit} className="w-100 mb-1 mt-3" >Save</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </>
      }
    </>
  )
}
