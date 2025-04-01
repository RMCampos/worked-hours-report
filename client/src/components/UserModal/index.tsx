import React, { useContext, useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AuthContext } from '../../context/authContext';
import { useTheme } from '../../context/themeContext';
import { useMessage } from '../../context/MessageContext';
import './style.css';

type Props = {
  show: boolean;
  onHide: () => void;
};

/**
 * Renders a modal with Markdown format text.
 *
 * @param {Props} props The ModalMarkdown props with show, title and text.
 * @param {boolean} props.show Defines when to display the modal.
 * @param {Function} props.onHide The function to be called when closing the modal.
 * @returns {React.ReactNode} the Markdown component rendered.
 */
const UserModal: React.FC<Props> = (props: Props): React.ReactNode => {
  const [validated, setValidated] = useState<boolean>(false);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(true);
  const { signUp, signIn } = useContext(AuthContext);
  const { theme } = useTheme();
  const { showMessage, hideMessage } = useMessage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      setErrorMessage('Please fill in your username and password!');
      return;
    }

    setFormInvalid(false);

    if (alreadyRegistered) {
      showMessage('loading', 'Signin you in...');

      const result = await signIn(email, password);
      if (result instanceof Error) {
        setFormInvalid(true);
        setErrorMessage(result.message);
      }
      else if (typeof result === 'boolean' && result === true) {
        hideMessage();
        props.onHide();
      }
    }
    else {
      showMessage('loading', 'Signin you up...');

      const result = await signUp(email, password);
      if (result instanceof Error) {
        setFormInvalid(true);
        setErrorMessage(result.message);
      }
      else if (typeof result === 'boolean' && result === true) {
        setErrorMessage('');
        setEmail('');
        setPassword('');
        setAlreadyRegistered(true);
        hideMessage();
        props.onHide();
      }
    }
  };

  useEffect(() => {}, [formInvalid]);

  return props.show
    ? (
        <Modal
          show={props.show}
          onHide={props.onHide}
          backdrop="static"
          keyboard={false}
          size="xl"
          aria-labelledby="markdown-modal-content"
          dialogClassName={theme === 'dark' ? 'modal-bg-dark' : ''}
        >
          <Modal.Header closeButton>
            <Modal.Title
              id="markdown-modal-content"
              data-testid="modal-header-title"
            >
              Sig In or Sign Up to a new account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="markdown-modal">
            {formInvalid
              ? (
                  <Alert variant="danger">
                    { errorMessage }
                  </Alert>
                )
              : null}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Type your email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Type your password"
                />
              </Form.Group>

              <Form.Check // prettier-ignore
                type="checkbox"
                id="default-checkbox"
                label="I already have an account"
                checked={alreadyRegistered}
                onChange={() => {
                  setAlreadyRegistered((prevValue: boolean) => !prevValue);
                }}
              />

              <Button
                variant="primary"
                type="submit"
                className="mt-2"
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )
    : null;
};

export default UserModal;
