import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyView() {
  const [error, setError] = useState("");
  const { logOut } = useAuth();
  const { currentUser } = useAuth();
  async function handleLogOut() {
    await logOut();
  }
  return (
    <>
    <Card>
      <Card.Body>
      <h2 className="text-center mb-4">Sign up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <strong>Email: </strong>{currentUser.email}
      </Card.Body>

    </Card>
    <div className="w-100 text-center mt-2">
      <Button variant="link" onClick={handleLogOut}>Log OUt</Button>
    </div>
    </>
  )
}
