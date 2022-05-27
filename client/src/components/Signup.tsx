import React, { useState, FormEvent, useEffect } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import InputField from './InputField';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpError } from '../interfaces/AuthenticationError';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Signup() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement | null>(null);
  const [formErrors, setFormErrors] = useState<SignUpError>({})
  const { signUp, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home')
    }
  }, [currentUser, navigate])


  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    setFormErrors({});
    event.preventDefault();
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    const confirmPassword = passwordConfirmRef.current!.value;
    const errors: SignUpError = {};

    if (!email) {
      errors.email = "Email must not be empty"
    }
    if (!password) {
      errors.password = "Password must not be empty"
    }
    if (password !== confirmPassword) {
      errors.password2 = "Passwords don't match"
    }
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return;
    }

    setFormErrors({});
    setLoading(true);
    const res = await signUp(emailRef.current!.value, passwordRef.current!.value);
    if (res.ok) {
      navigate(`/set-profile/${res.id}`);
    } else {
      const error = res.error
      if (error.code === 'auth/email-already-in-use') {
        setFormErrors({
          globalError: "Failed to create an account",
          email: "Email already in use"
        });
      } else if (error.code === 'auth/weak-password') {
        setFormErrors({
          globalError: "Failed to create an account",
          password: "Password should be at least 6 characters long"
        });

      } else {
        setFormErrors({ globalError: "Failed to create an account" })
      }
    }
    setLoading(false);
  }


  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ margin: "auto" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }} >      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign up</h2>
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
            <InputField
              name="password2"
              label='Confirm Password'
              type='password'
              fieldref={passwordConfirmRef}
              error={formErrors.password2}
            />
            <Button
              disabled={loading}
              type="submit"
              className="w-100"
              style={{ marginTop: "10px" }}
            >
              Sign up
            </Button>
          </Form>
        </Card.Body>
      </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </Container>
  )
}
