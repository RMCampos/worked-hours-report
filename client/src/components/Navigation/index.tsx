import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../../context/authContext';
import UserModal from '../UserModal';
import { useTheme } from '../../context/themeContext';

function Navigation() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { signed, checkLogin, username, signOut } = useContext(AuthContext);
  const { theme } = useTheme();

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
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between" bg={theme} data-bs-theme={theme}>
      <Container>
        <Navbar.Brand href="/">Worked Hours</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {signed && (
            <Navbar.Text>
              Signed in as:
              {' '}
              <b>{username}</b>
              {' '}
              <a href="#" title="Logout" onClick={signOutFn}>SignOut</a>
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
