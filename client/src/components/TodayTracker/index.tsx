import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import TodayInput from '../TodayInput';
import {
  calculateWorkedHours,
  calculateCompletionTime,
  getHourMinuteLeftArrayFromMinutes
} from '../../hours-service';
import { TodayTrackerStore } from '../../types/todayTrackerStore';
import { getDayOfTheWeek, getDayExtension, getMonthName } from '../../date-service';
import { useTheme } from '../../context/themeContext';
import TodayTrackerResultText from '../TodayTrackerResultText';
import { EMPTY_HOUR_MINUTE } from '../../constants/appDefinitions';
import { DayDirection } from '../../enums/dayDirection';
import { createTimeForUserAndDay, getTimesForUserAndDay, updateTimesForUserAndDay } from '../../storage-service/server';
import { AuthContext } from '../../context/authContext';
import { useMessage } from '../../context/MessageContext';
import { getError } from '../../services/ErrorService';
import './styles.css';

function TodayTracker(): React.ReactNode {
  const [timeOne, setTimeOne] = useState<string>('');
  const [timeTwo, setTimeTwo] = useState<string>('');
  const [timeThree, setTimeThree] = useState<string>('');
  const [timeFour, setTimeFour] = useState<string>('');
  const [timeFive, setTimeFive] = useState<string>('');
  const [timeSix, setTimeSix] = useState<string>('');
  const [totalWorkedHours, setTotalWorkedHours] = useState<string>(EMPTY_HOUR_MINUTE);
  const [willCompleteAt, setWillCompleteAt] = useState<string>('00:00');
  const [timeLeft, setTimeLeft] = useState<string>(EMPTY_HOUR_MINUTE);
  const [extraHours, setExtraHours] = useState<string>(EMPTY_HOUR_MINUTE);
  const [dateMessage, setDateMessage] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [displayDaySummary, setDisplayDaySummary] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('');
  const { theme } = useTheme();
  const { username } = useContext(AuthContext);
  const { showMessage, hideMessage } = useMessage();

  /**
   * Handles the submit, after clicking 'Calculate and save' button.
   * @param {React.FormEvent<HTMLFormElement>} event The form submit event.
   */
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

    const totalWorked: number[] = calculateWorkedHours(timeValues);

    // Total worked
    const totalWorkedText = `${totalWorked[0]}h ${totalWorked[1]}m`;
    setTotalWorkedHours(totalWorkedText);

    // Completion time
    const completionTimeArray = calculateCompletionTime(totalWorked);
    const willCompleteAtText = completionTimeArray.length === 1
      ? completionTimeArray[0]
      : `${completionTimeArray[0]}:${completionTimeArray[1]}`;
    setWillCompleteAt(willCompleteAtText);

    // TimeLeft
    const leftArray = getHourMinuteLeftArrayFromMinutes(totalWorked[1] + (totalWorked[0] * 60));
    const leftH = leftArray[0];
    const leftM = leftArray[1];
    const timeLeftText = leftArray[0] === 0 && leftArray[1] <= 0
      ? EMPTY_HOUR_MINUTE
      : `${leftH}h ${leftM}m`;
    setTimeLeft(timeLeftText);

    // Extra hours
    let extraHoursText = `${EMPTY_HOUR_MINUTE}`;
    if (totalWorked[0] >= 8 && totalWorked[1]) {
      extraHoursText = `${totalWorked[0] - 8}h ${totalWorked[1]}m`;
    }
    setExtraHours(extraHoursText);

    const formattedToSave = `${currentDay.getFullYear()}/${currentDay.getMonth()}/${currentDay.getDate()}`;

    const objToSave: TodayTrackerStore = {
      day: formattedToSave,
      time1: timeOne,
      time2: timeTwo,
      time3: timeThree,
      time4: timeFour,
      time5: timeFive,
      time6: timeSix,
      totalWorkedHours: totalWorkedText,
      willCompleteAt: willCompleteAtText,
      timeLeft: timeLeftText,
      extraHours: extraHoursText,
      documentId: null
    };

    setDisplayDaySummary(true);

    if (!username) {
      return;
    }

    if (objToSave.extraHours.startsWith('Extra:')) {
      objToSave.extraHours = objToSave.extraHours.substring(7);
    }

    try {
      showMessage('loading', 'Saving your data...');

      if (documentId) {
        objToSave.documentId = documentId;
        await updateTimesForUserAndDay(username, formattedToSave, objToSave);
      }
      else {
        const newId = await createTimeForUserAndDay(username, formattedToSave, objToSave);
        if (newId) {
          setDocumentId(newId);
        }
      }

      hideMessage();
    }
    catch (err) {
      showMessage('error', getError(err));
    }
  };

  /**
   * Clears all the input fields.
   */
  const clearInputs = (): void => {
    setTimeOne('');
    setTimeTwo('');
    setTimeThree('');
    setTimeFour('');
    setTimeFive('');
    setTimeSix('');
    setDisplayDaySummary(false);
  };

  /**
   * Load a given day from the server.
   *
   * @param {TodayTrackerStore} store The data to be loaded.
   */
  const loadFromStorage = (store: TodayTrackerStore | null): void => {
    if (store) {
      setTimeOne(store.time1);
      setTimeTwo(store.time2);
      setTimeThree(store.time3);
      setTimeFour(store.time4);
      setTimeFive(store.time5);
      setTimeSix(store.time6);
      setTotalWorkedHours(store.totalWorkedHours);
      setWillCompleteAt(store.willCompleteAt);
      setTimeLeft(store.timeLeft);
      setExtraHours(store.extraHours);
    }
    else {
      setTimeOne('');
      setTimeTwo('');
      setTimeThree('');
      setTimeFour('');
      setTimeFive('');
      setTimeSix('');
      setTotalWorkedHours('');
      setWillCompleteAt('');
      setTimeLeft('');
      setExtraHours('');
    }
  };

  /**
   * Loads the message for a given day.
   *
   * @param {Date} theDay the day to be loaded.
   */
  const loadTodayDateMessage = (theDay: Date): void => {
    const parts: string[] = [];
    parts.push(getDayOfTheWeek(theDay.getDay()));
    parts.push(', ');
    parts.push(getMonthName(theDay.getMonth()));
    parts.push(' ');
    parts.push(theDay.getDate().toString());
    parts.push(getDayExtension(theDay.getDate()));
    parts.push(', ');
    parts.push(theDay.getFullYear().toString());

    const finalMessage = parts.join('');
    setDateMessage(finalMessage);
  };

  /**
   * Change the current day being displayed.
   *
   * @param sign {DayDirection} the sign defining the direction
   */
  const goToDay = (sign: DayDirection): void => {
    let currentDate = new Date(currentDay);

    if (sign === DayDirection.TOMORROW) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    else if (sign === DayDirection.YESTERDAY) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    else {
      currentDate = new Date();
    }

    setCurrentDay(currentDate);
  };

  useEffect(() => {
    loadTodayDateMessage(currentDay);
    if (username) {
      const load = async () => {
        try {
          setDocumentId('');
          showMessage('loading', 'Fetching data...');
          const formatted = `${currentDay.getFullYear()}/${currentDay.getMonth()}/${currentDay.getDate()}`;
          const result: TodayTrackerStore = await getTimesForUserAndDay(username, formatted);
          if (result && result.documentId) {
            setDocumentId(result.documentId);
          }
          loadFromStorage(result);
          hideMessage();
        }
        catch (error) {
          showMessage('error', getError(error));
        }
      };

      load();
    }
  }, [currentDay, username]);

  return (
    <>
      <div className={`card p-4 shadow-sm my-3 ${theme === 'light' ? 'text-bg-light' : 'card-bg-dark'}`}>
        <h1 className={`my-4 ${theme === 'light' ? 'text-dark' : 'text-light'}`}>WorkedHours</h1>
        <Row>
          <Col xs={12} md={6} className="text-center">
            <h4 className={`smart-title ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{dateMessage}</h4>
          </Col>
          <Col xs={12} md={6} className="text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => goToDay(DayDirection.YESTERDAY)}
              className={`mx-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            >
              <ArrowLeft />
              {' '}
              Previous day
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => goToDay(DayDirection.TODAY)}
              className={`mx-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            >
              Today
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => goToDay(DayDirection.TOMORROW)}
              className={`mx-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            >
              Next day
              {' '}
              <ArrowRight />
            </Button>
          </Col>
        </Row>

        <Form noValidate validated={true} onSubmit={handleSubmit} className="mt-4">
          <Row>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time1"
                labelText="Starting time"
                helpText="What time did you start working?"
                globalValue={timeOne}
                setGlobalValue={setTimeOne}
              />
            </Col>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time2"
                labelText="Stopped for lunch - Lunchtime"
                helpText="What time did you stop for lunch?"
                globalValue={timeTwo}
                setGlobalValue={setTimeTwo}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time3"
                labelText="Started after lunch"
                helpText="What time did you start after lunch?"
                globalValue={timeThree}
                setGlobalValue={setTimeThree}
              />
            </Col>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time4"
                labelText="Stopped? Quick Break?"
                helpText="What time did you stop working? Went for a break?"
                globalValue={timeFour}
                setGlobalValue={setTimeFour}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time5"
                labelText="Joined again?"
                helpText="What time did you join again?"
                globalValue={timeFive}
                setGlobalValue={setTimeFive}
              />
            </Col>
            <Col xs={12} md={6}>
              <TodayInput
                inputId="time6"
                labelText="Final stop!"
                helpText="What time did you finally stop?"
                globalValue={timeSix}
                setGlobalValue={setTimeSix}
              />
            </Col>
          </Row>

          <div className="text-end">
            <Button
              variant="primary"
              type="submit"
            >
              Calculate and save
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={clearInputs}
              className={`mx-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            >
              Clear form
            </Button>
          </div>
        </Form>
      </div>

      {displayDaySummary && (
        <div className={`card p-4 shadow-sm mb-4 ${theme === 'light' ? 'text-bg-light' : 'card-bg-dark'}`}>
          <Row className="mt-2">
            <Col xs={6}>
              <TodayTrackerResultText
                label="Total worked"
                value={totalWorkedHours}
              />
              <TodayTrackerResultText
                label="You will complete 8 hours at"
                value={willCompleteAt}
              />
            </Col>
            <Col xs={6}>
              <TodayTrackerResultText
                label="Time left"
                value={timeLeft}
              />
              <TodayTrackerResultText
                label="Extra"
                value={extraHours}
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default TodayTracker;
