import React, { useState } from 'react';
import '../styling/Footer.scss';
import { useAuth } from '../contexts/AuthContext';
import FooterLink from './FooterLink';
import Modal from 'react-bootstrap/Modal';
import ButtonWide from './ButtonWide';

export default function Footer() {
  const { currentUser, logOut } = useAuth();
  const [logOutWindowVisible, setLogOutWindowVisible] = useState(false);
  const [logOutMessageVisible, setLogOutMessageVisible] = useState(false);

  function closeLogOutWindow() {
    setLogOutWindowVisible(false);
  }
  function loggingOut() {
    setLogOutMessageVisible(true);
    setTimeout(() => {
      logOut();
      closeLogOutWindow();
      setTimeout(() => {
        setLogOutMessageVisible(false);
      }, 500);
    }, 1200);
  }

  return (
    <div className="Footer">
      <FooterLink to="/">
        <i className="bi bi-house"></i>
        <p>Home</p>
      </FooterLink>
      <FooterLink to="/chats">
        <i className="bi bi-chat-dots"></i>
        <p>Messages</p>
      </FooterLink>
      <FooterLink to="/add-listing">
        <i className="bi bi-plus-circle"></i>
        <p>Add Listing</p>
      </FooterLink>
      <FooterLink to={`/profile/${currentUser?.id}`}>
        <i className="bi bi-person"></i>
        <p>Account</p>
      </FooterLink>
      <button
        onClick={() => setLogOutWindowVisible(true)}
        style={{ border: 'none', backgroundColor: 'transparent' }}
        className="FooterLink"
      >
        <i className="bi bi-gear"></i>
        <p>Settings</p>
      </button>

      <Modal size="sm" centered show={logOutWindowVisible} onHide={closeLogOutWindow}>
        <Modal.Header closeButton>Settings</Modal.Header>
        <Modal.Body>
          <div className={`log-out-box ${logOutMessageVisible && 'hide-div'}`}>
            <div style={{ width: '100%' }} onClick={loggingOut}>
              <ButtonWide content={'Log out'} fill={true} />
            </div>
            <div style={{ width: '100%' }} onClick={closeLogOutWindow}>
              <ButtonWide content={'Cancel'} fill={false} />
            </div>
          </div>
          <div className={`log-out-box ${!logOutMessageVisible && 'hide-div'}`}>
            <p>See you very soon!</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
