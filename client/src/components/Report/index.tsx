import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { months, years } from './data';
import { IdAndValue } from '../../types/IdAndValue';

function Report(): JSX.Element {
  return (
    <>
      <h1>Monthly Report</h1>

      <span>Period:</span>
      <Row>
        <Col xs={4}>
          <Form.Select aria-label="Default select example">
            <option>Select a month</option>
            {months.map((theMonth: IdAndValue) => (
              <option key={theMonth.id} value={theMonth.id}>{theMonth.value}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={4}>
          <Form.Select aria-label="Default select example">
            <option>Select the year</option>
            {years.map((theYear: IdAndValue) => (
              <option key={theYear.id} value={theYear.id}>{theYear.value}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={4}>
          <Button
            variant="primary"
            type="button"
          >
            Load
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="ms-2"
          >
            Load current
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Report;
