import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import TodayInput from '../TodayInput';
import {
  calculateWorkedHours,
  calculateCompletionTime,
  getHourMinuteLeftArrayFromMinutes
} from '../../hours-service';
import { TodayTrackerStore } from '../../types/todayTrackerStore';
import { saveTodayTracker, loadTodayTracker } from '../../storage-service/storage';

function TodayTracker(): JSX.Element {
  const [timeOne, setTimeOne] = useState<string>('');
  const [timeTwo, setTimeTwo] = useState<string>('');
  const [timeThree, setTimeThree] = useState<string>('');
  const [timeFour, setTimeFour] = useState<string>('');
  const [timeFive, setTimeFive] = useState<string>('');
  const [timeSix, setTimeSix] = useState<string>('');
  const [totalWorkedHours, setTotalWorkedHours] = useState<string>('0h 0m');
  const [willCompleteAt, setWillCompleteAt] = useState<string>('00:00');
  const [timeLeft, setTimeLeft] = useState<string>('0h 0m');
  const [extraHours, setExtraHours] = useState<string>('0h 0m');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    const timeValues: string[] = [];
    if (timeOne.length) {
      timeValues.push(timeOne);
    }
    if (timeTwo.length) {
      timeValues.push(timeTwo);
    }
    if (timeThree.length) {
      timeValues.push(timeThree);
    }
    if (timeFour.length) {
      timeValues.push(timeFour);
    }
    if (timeFive.length) {
      timeValues.push(timeFive);
    }
    if (timeSix.length) {
      timeValues.push(timeSix);
    }

    const totalWorkd: number[] = calculateWorkedHours(timeValues);

    // Total worked
    const totalWorkedText = `${totalWorkd[0]}h ${totalWorkd[1]}m`;
    setTotalWorkedHours(totalWorkedText);

    // Completion time
    const completionTimeArray = calculateCompletionTime(totalWorkd);
    const willCompleteAtText = completionTimeArray.length === 1
      ? completionTimeArray[0]
      : `${completionTimeArray[0]}:${completionTimeArray[1]}`;
    setWillCompleteAt(willCompleteAtText);

    // TimeLeft
    const leftArray = getHourMinuteLeftArrayFromMinutes(totalWorkd[1] + (totalWorkd[0] * 60));
    const leftH = leftArray[0];
    const leftM = leftArray[1];
    const timeLeftText = leftArray[0] === 0 && leftArray[1] <= 0
      ? '0h 0m'
      : `${leftH}h ${leftM}m`;
    setTimeLeft(timeLeftText);

    // Extra hours
    let extraHoursText = 'Extra: 0h 0m';
    if (totalWorkd[0] >= 8 && totalWorkd[1]) {
      extraHoursText = `Extra: ${totalWorkd[0] - 8}h ${totalWorkd[1]}m`;
    }
    setExtraHours(extraHoursText);

    const objToSave: TodayTrackerStore = {
      time1: timeOne,
      time2: timeTwo,
      time3: timeThree,
      time4: timeFour,
      time5: timeFive,
      time6: timeSix,
      totalWorkedHours: totalWorkedText,
      willCompleteAt: willCompleteAtText,
      timeLeft: timeLeftText,
      extraHours: extraHoursText
    };

    saveTodayTracker(objToSave);
  };

  const clearInputs = (): void => {
    setTimeOne('');
    setTimeTwo('');
    setTimeThree('');
    setTimeFour('');
    setTimeFive('');
    setTimeSix('');
  };

  const loadFromStorage = (): void => {
    const data: TodayTrackerStore | undefined = loadTodayTracker();
    if (data) {
      setTimeOne(data.time1);
      setTimeTwo(data.time2);
      setTimeThree(data.time3);
      setTimeFour(data.time4);
      setTimeFive(data.time5);
      setTimeSix(data.time6);
      setTotalWorkedHours(data.totalWorkedHours);
      setWillCompleteAt(data.willCompleteAt);
      setTimeLeft(data.timeLeft);
      setExtraHours(data.extraHours);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <>
      <Form noValidate validated={true} onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
            <TodayInput
              inputId="time1"
              labelText="Starting time"
              placeholderText="08:00"
              helpText="What time did you start working?"
              globalValue={timeOne}
              setGlobalValue={setTimeOne}
            />
          </Col>
          <Col xs={6}>
            <TodayInput
              inputId="time2"
              labelText="Stopped for lunch - Lunchtime"
              placeholderText="12:00"
              helpText="What time did you stop for lunch?"
              globalValue={timeTwo}
              setGlobalValue={setTimeTwo}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <TodayInput
              inputId="time3"
              labelText="Started after lunch"
              placeholderText="13:00"
              helpText="What time did you start after lunch?"
              globalValue={timeThree}
              setGlobalValue={setTimeThree}
            />
          </Col>
          <Col xs={6}>
            <TodayInput
              inputId="time4"
              labelText="Stopped? Quick Break?"
              placeholderText="17:00"
              helpText="What time did you stop working? Went for a break?"
              globalValue={timeFour}
              setGlobalValue={setTimeFour}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <TodayInput
              inputId="time5"
              labelText="Joined again?"
              placeholderText="18:00"
              helpText="What time did you join again?"
              globalValue={timeFive}
              setGlobalValue={setTimeFive}
            />
          </Col>
          <Col xs={6}>
            <TodayInput
              inputId="time6"
              labelText="Final stop!"
              placeholderText="22:00"
              helpText="What time did you finally stop?"
              globalValue={timeSix}
              setGlobalValue={setTimeSix}
            />
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
        >
          Calculate
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={clearInputs}
          className="mx-2"
        >
          Clear all
        </Button>
      </Form>

      <Row className="mt-2">
        <Col xs={12}>
          <h3>
            Total worked:
            {' '}
            {totalWorkedHours}
          </h3>
          <h3>
            You will complete 8 hours at:
            {' '}
            {willCompleteAt}
          </h3>
          <h3>
            Time left:
            {' '}
            {timeLeft}
          </h3>
          <h3>
            Extra:
            {' '}
            {extraHours}
          </h3>
        </Col>
      </Row>
    </>
  );
}

export default TodayTracker;
