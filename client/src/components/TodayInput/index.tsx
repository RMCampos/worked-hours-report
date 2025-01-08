import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

interface Props {
  inputId: string;
  labelText: string;
  placeholderText: string;
  helpText: string;
  globalValue: string;
  setGlobalValue: (inputValue: string) => void;
}

function TodayInput(props: Props): JSX.Element {
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
      <Form.Label>{props.labelText}</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text onClick={() => setCurrentTime()}>
          <PencilFill />
        </InputGroup.Text>
        <Form.Control
          type="text"
          name={props.inputId}
          placeholder={props.placeholderText}
          value={props.globalValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.setGlobalValue(e.target.value);
          }}
        />
      </InputGroup>
      <Form.Text muted>
        {props.helpText}
      </Form.Text>
    </Form.Group>
  );
}

export default TodayInput;
