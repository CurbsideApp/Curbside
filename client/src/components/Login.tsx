import React, { FormEvent, useEffect, useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import InputField from './InputField';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogInError } from '../interfaces/AuthenticationError';

export default function Login() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const [formErrors, setFormErrors] = useState<LogInError>({})
  const { currentUser, logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

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
    setFormErrors({});
    setLoading(true);
    const res = await logIn(emailRef.current!.value, passwordRef.current!.value)
    if (res.ok) {
      navigate('/')
    } else {
      const error = res.error;
      if (error.code === 'auth/too-many-requests') {
        setFormErrors({ globalError: "Too many requests, try again later" })
      } else if (error.code === 'auth/wrong-password') {
        setFormErrors({
          globalError: "Wrong credentials",
        })
      } else {
        setFormErrors({ globalError: "Failed to log in" })

      }
    }

    setLoading(false);
  }

  return (
    <div className='form-container' >
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ margin: "auto" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }} >
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
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-100"
                  name="submitLogIn"
                  style={{ marginTop: "10px" }}
                >
                  Log in
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </Container >
    </div >
  )
}
