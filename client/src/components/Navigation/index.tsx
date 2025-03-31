import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../../context/authContext';
import UserModal from '../UserModal';

function Navigation() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { signed, checkLogin, username, signOut } = useContext(AuthContext);

  const signInRegister = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();
    e.stopPropagation();

    setShowModal(true);
  };

  const signOutFn = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();
    e.stopPropagation();

    signOut();
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    checkLogin();
  }, [signed]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="#">Worked Hours</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {signed && (
            <Navbar.Text>
              Signed in as:
              {' '}
              <a href="#" title="Logout" onClick={signOutFn}>{username}</a>
            </Navbar.Text>
          )}

          {!signed && (
            <Navbar.Text>
              <a href="#" title="SignUp or SignIn user" onClick={signInRegister}>SignIn/Register</a>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>

      <UserModal
        show={showModal}
        onHide={handleCloseModal}
      />
    </Navbar>
  );
}

export default Navigation;
