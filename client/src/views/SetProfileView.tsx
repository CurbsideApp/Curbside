
import React, { FormEvent, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';
import InputField from '../components/InputField';
import Map from '../components/SetProfileMap';
import { useNavigate } from 'react-router-dom';

export default function SetProfileView() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<{[key:string]:string}>({});
  const [position, setPosition] = useState({lng:13.39, lat:52.51})

  const api = useApi();
  const navigate = useNavigate();

  async function handleSubmit (event: FormEvent) {
    event.preventDefault();
    console.log('is in handleSubmit');
    const name = nameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const errors: {[key:string]:string} = {};

    if (!name) {
      errors.name = "Name must not be empty"
    }
    if (!lastName) {
      errors.lastName = "Last name must not be empty"
    }
    setFormErrors(errors);
    if(Object.keys(errors).length >0) {
      console.log(errors);
      return;
    }
    if (name && lastName) {
      const additionalUserInfo = {
        firstName: name,
        lastName: lastName,
        city: 'Berlin',
        longitude: position.lng,
        latitude:position.lat
      };
      console.log({additionalUserInfo});

      const res = await api.patch(`/users/${'4f4442a7-aa22-490b-9945-34763d9fa0d9'}`, additionalUserInfo);
      if (res.ok) {
        navigate('/explore')
      } else {
        // Need to add notification to customer
        console.log('ERROR')
      }

    }
  }


  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Set up Profile</h2>
          <Form onSubmit={handleSubmit}>
            <InputField
              name="name"
              label='Name'
              type='text'
              fieldref={nameRef}
              error={formErrors.name}
            />
            <InputField
              name="lastName"
              label='Last Name'
              type='text'
              fieldref={lastNameRef}
              error={formErrors.lastName}
            />
          <p>My Location</p>
          <Map position={position} setPosition={setPosition}/>
          <Button type="submit" className="w-100" >Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
