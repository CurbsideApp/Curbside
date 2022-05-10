import React from 'react';
import { Container } from 'react-bootstrap';
import Login from '../components/Login';

export default function LoginView() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }} >
        <Login />
      </div>
    </Container>
  )
}
