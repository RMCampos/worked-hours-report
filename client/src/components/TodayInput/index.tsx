import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useTheme } from '../../context/themeContext';

interface Props {
  inputId: string;
  labelText: string;
  helpText: string;
  globalValue: string;
  setGlobalValue: (inputValue: string) => void;
}

function TodayInput(props: Props): React.ReactNode {
  const { theme } = useTheme();

  const setCurrentTime = (): void => {
    const date = new Date();
    let currentText = '';
    if (date.getHours() < 9) {
      currentText += `0${date.getHours()}`;
    }
    else {
      currentText += date.getHours().toString();
    }

    currentText += ':';

    if (date.getMinutes() < 9) {
      currentText += `0${date.getMinutes()}`;
    }
    else {
      currentText += date.getMinutes();
    }

    props.setGlobalValue(currentText);
  };

  return (
    <Form.Group className="mb-3" controlId={props.inputId}>
      <Form.Label className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>{props.labelText}</Form.Label>
      <InputGroup className="">
        <InputGroup.Text onClick={() => setCurrentTime()}>&#x1F550;</InputGroup.Text>
        <Form.Control
          type="text"
          name={props.inputId}
          value={props.globalValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.setGlobalValue(e.target.value);
          }}
        />
      </InputGroup>
      <Form.Text className={`${theme === 'light' ? 'text-muted' : 'text-dark-muted'}`}>
        {props.helpText}
      </Form.Text>
    </Form.Group>
  );
}

export default TodayInput;
