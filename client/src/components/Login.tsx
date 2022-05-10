import React, { FormEvent, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import InputField from './InputField';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogInError } from '../interfaces/AuthenticationError';

export default function Login() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const [formErrors, setFormErrors] = useState<LogInError>({})
  const { logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    setFormErrors({});
    event.preventDefault();
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    const errors: LogInError = {};
    
    if (!email) {
      errors.email = "Email must not be empty"
    }
    if (!password) {
      errors.password = "Password must not be empty"
    }
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      setFormErrors({});
      setLoading(true);
      const firebaseLogIn = await logIn(emailRef.current!.value, passwordRef.current!.value)
      const userToken = firebaseLogIn.user.multiFactor.user.accessToken;
      localStorage.setItem("userToken", JSON.stringify(userToken));
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        setFormErrors({globalError : "Too many requests, try again later"})
      } else if (error.code === 'auth/wrong-password') {
        setFormErrors({
          globalError : "Wrong credentials",
        })
      } else {
        setFormErrors({globalError : "Failed to log in"})

      }
    }
    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log in</h2>
          <Form.Text className={'text-danger'}>{formErrors.globalError}</Form.Text>
          <Form onSubmit={handleSubmit}>
            <InputField
              name="email"
              label='Email'
              type='email'
              fieldref={emailRef}
              error={formErrors.email}
            />
            <InputField
              name="password"
              label='Password'
              type='password'
              fieldref={passwordRef}
              error={formErrors.password}
            />
            <Button disabled={loading} type="submit" className="w-100" >Log in</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign up</Link>
      </div>
    </>
  )
}
