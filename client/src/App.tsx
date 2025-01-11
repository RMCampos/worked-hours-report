import React from 'react';
import { Container } from 'react-bootstrap';
import TodayTracker from './components/TodayTracker';
import Report from './components/Report';
import './styles/custom.scss';

/**
 * The main application component that sets up routing based on the
 * user's authentication status.
 *
 * @component
 * @returns {React.ReactNode} The rendered component.
 */
function App(): React.ReactNode {
  return (
    <Container className="body-light">
      <h1>Worked hours calculator</h1>
      <TodayTracker />
      <hr />
      <Report />
    </Container>
  );
};

export default App;
