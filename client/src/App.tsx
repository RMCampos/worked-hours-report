import React from 'react';
import { Container } from 'react-bootstrap';
import TodayTracker from './components/TodayTracker';
import Report from './components/Report';
import DarkButton from './components/DarkButton';
import Navigation from './components/Navigation';
import { useTheme } from './context/themeContext';
import './styles/custom.scss';

/**
 * The main application component that sets up routing based on the
 * user's authentication status. This is the App component.
 *
 * @component
 * @returns {React.ReactNode} The rendered component.
 */
function App(): React.ReactNode {
  const { theme } = useTheme();

  return (
    <>
      <Navigation />
      <Container fluid className={`text-bg-${theme}`}>
        <TodayTracker />
        <Report />
        <DarkButton />
      </Container>
    </>
  );
};

export default App;
