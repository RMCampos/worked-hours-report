import React from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { useMessage } from '../../context/MessageContext';
import { useTheme } from '../../context/themeContext';

export const GlobalMessage: React.FC = () => {
  const { messageType, message, hideMessage } = useMessage();
  const { theme } = useTheme();

  if (!messageType) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050
      }}
    >
      <div className="bg-white p-4 rounded shadow-lg">
        {messageType === 'error'
          ? (
              <>
                <Alert
                  variant="danger"
                  onClose={hideMessage}
                  dismissible
                  className="mb-3"
                >
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{message}</p>
                </Alert>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={hideMessage}>
                    Close
                  </Button>
                </div>
              </>
            )
          : (
              <div className={`text-center ${theme === 'dark' ? 'text-dark' : ''}`}>
                <Spinner animation="border" role="status" className="mb-3" />
                <p className="mb-0">{message || 'Loading...'}</p>
              </div>
            )}
      </div>
    </div>
  );
};
