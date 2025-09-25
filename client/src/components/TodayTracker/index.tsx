import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row, Card } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, Play, Stop, Clock } from 'react-bootstrap-icons';
import {
  calculateWorkedHours,
  calculateCompletionTime,
  calculateBreakTime,
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

enum WorkState {
  NOT_STARTED = 'not_started',
  WORKING = 'working',
  ON_BREAK = 'on_break',
  COMPLETED = 'completed'
}

function TodayTracker(): React.ReactNode {
  const [timeOne, setTimeOne] = useState<string>('');
  const [timeTwo, setTimeTwo] = useState<string>('');
  const [timeThree, setTimeThree] = useState<string>('');
  const [timeFour, setTimeFour] = useState<string>('');
  const [timeFive, setTimeFive] = useState<string>('');
  const [timeSix, setTimeSix] = useState<string>('');
  const [workState, setWorkState] = useState<WorkState>(WorkState.NOT_STARTED);
  const [totalWorkedHours, setTotalWorkedHours] = useState<string>(EMPTY_HOUR_MINUTE);
  const [totalBreakTime, setTotalBreakTime] = useState<string>(EMPTY_HOUR_MINUTE);
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
   * Gets current time as HH:MM string
   */
  const getCurrentTime = (): string => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /**
   * Determines the current work state based on filled time slots
   */
  const determineWorkState = (): WorkState => {
    if (!timeOne) return WorkState.NOT_STARTED;
    if (!timeTwo) return WorkState.WORKING;
    if (!timeThree) return WorkState.ON_BREAK;
    if (!timeFour) return WorkState.WORKING;
    if (!timeFive) return WorkState.ON_BREAK;
    if (!timeSix) return WorkState.WORKING;
    return WorkState.COMPLETED;
  };

  /**
   * Handles the main clock button click
   */
  const handleClockButtonClick = (): void => {
    const currentTime = getCurrentTime();
    const state = determineWorkState();

    switch (state) {
      case WorkState.NOT_STARTED:
        setTimeOne(currentTime);
        setWorkState(WorkState.WORKING);
        break;
      case WorkState.WORKING:
        if (!timeTwo) {
          setTimeTwo(currentTime);
          setWorkState(WorkState.ON_BREAK);
        }
        else if (!timeFour) {
          setTimeFour(currentTime);
          setWorkState(WorkState.ON_BREAK);
        }
        else if (!timeSix) {
          setTimeSix(currentTime);
          setWorkState(WorkState.COMPLETED);
          calculateAndSave();
        }
        break;
      case WorkState.ON_BREAK:
        if (!timeThree) {
          setTimeThree(currentTime);
          setWorkState(WorkState.WORKING);
        }
        else if (!timeFive) {
          setTimeFive(currentTime);
          setWorkState(WorkState.WORKING);
        }
        break;
    }
  };

  /**
   * Calculates and saves the work data
   */
  const calculateAndSave = async (): Promise<void> => {
    const timeValues: string[] = [];
    if (timeOne.length) timeValues.push(timeOne);
    if (timeTwo.length) timeValues.push(timeTwo);
    if (timeThree.length) timeValues.push(timeThree);
    if (timeFour.length) timeValues.push(timeFour);
    if (timeFive.length) timeValues.push(timeFive);
    if (timeSix.length) timeValues.push(timeSix);

    const totalWorked: number[] = calculateWorkedHours(timeValues);

    // Total worked
    const totalWorkedText = `${totalWorked[0]}h ${totalWorked[1]}m`;
    setTotalWorkedHours(totalWorkedText);

    // Total break time
    const totalBreak: number[] = calculateBreakTime(timeValues);
    const totalBreakText = `${totalBreak[0]}h ${totalBreak[1]}m`;
    setTotalBreakTime(totalBreakText);

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
      totalBreakTime: totalBreakText,
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
   * Clears all the input fields and resets work state.
   */
  const clearInputs = (): void => {
    setTimeOne('');
    setTimeTwo('');
    setTimeThree('');
    setTimeFour('');
    setTimeFive('');
    setTimeSix('');
    setWorkState(WorkState.NOT_STARTED);
    setTotalBreakTime(EMPTY_HOUR_MINUTE);
    setDisplayDaySummary(false);
  };

  /**
   * Gets the button text based on current work state
   */
  const getButtonText = (): string => {
    const state = determineWorkState();
    switch (state) {
      case WorkState.NOT_STARTED:
        return 'Start Working';
      case WorkState.WORKING:
        if (!timeTwo) return 'Take Break';
        if (!timeFour) return 'Take Break';
        if (!timeSix) return 'Stop Working';
        return 'Working...';
      case WorkState.ON_BREAK:
        return 'Resume Working';
      case WorkState.COMPLETED:
        return 'Day Completed';
      default:
        return 'Start Working';
    }
  };

  /**
   * Gets the button icon based on current work state
   */
  const getButtonIcon = (): React.ReactNode => {
    const state = determineWorkState();
    switch (state) {
      case WorkState.NOT_STARTED:
        return <Play size={24} />;
      case WorkState.WORKING:
        return <Stop size={24} />;
      case WorkState.ON_BREAK:
        return <Play size={24} />;
      case WorkState.COMPLETED:
        return <Clock size={24} />;
      default:
        return <Play size={24} />;
    }
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
      setTotalBreakTime(store.totalBreakTime || EMPTY_HOUR_MINUTE);
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
      setTotalBreakTime('');
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
    setWorkState(determineWorkState());
  }, [timeOne, timeTwo, timeThree, timeFour, timeFive, timeSix]);

  useEffect(() => {
    if (workState === WorkState.WORKING || workState === WorkState.ON_BREAK) {
      const interval = setInterval(() => {
        calculateAndSave();
      }, 30000); // Auto-save every 30 seconds while working

      return () => clearInterval(interval);
    }
  }, [workState, timeOne, timeTwo, timeThree, timeFour, timeFive, timeSix]);

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
          // Recalculate break time when loading from storage
          if (result && (result.time2 || result.time3 || result.time4 || result.time5)) {
            const timeValues: string[] = [result.time1, result.time2, result.time3, result.time4, result.time5, result.time6].filter(Boolean);
            const totalBreak: number[] = calculateBreakTime(timeValues);
            const totalBreakText = `${totalBreak[0]}h ${totalBreak[1]}m`;
            setTotalBreakTime(totalBreakText);
          }
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

        {/* Main Clock Button */}
        <div className="text-center my-5">
          <Card
            className={`clock-button-card mx-auto ${theme === 'light' ? 'text-bg-light border-primary' : 'card-bg-dark border-secondary'}`}
            style={{ maxWidth: '400px', cursor: determineWorkState() !== WorkState.COMPLETED ? 'pointer' : 'default' }}
            onClick={determineWorkState() !== WorkState.COMPLETED ? handleClockButtonClick : undefined}
          >
            <Card.Body className="p-5 text-center">
              <div className="mb-3">
                {getButtonIcon()}
              </div>
              <h3 className={`mb-2 ${theme === 'light' ? 'text-dark' : 'text-light'}`}>
                {getButtonText()}
              </h3>
              <p className={`mb-0 ${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>
                {getCurrentTime()}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Time Log Display */}
        {(timeOne || timeTwo || timeThree || timeFour || timeFive || timeSix) && (
          <Row className="mt-4">
            <Col xs={12}>
              <h5 className={`mb-3 ${theme === 'light' ? 'text-dark' : 'text-light'}`}>Today&apos;s Time Log</h5>
            </Col>
            {timeOne && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Started:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeOne}</div>
              </Col>
            )}
            {timeTwo && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Break started:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeTwo}</div>
              </Col>
            )}
            {timeThree && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Resumed:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeThree}</div>
              </Col>
            )}
            {timeFour && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Break started:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeFour}</div>
              </Col>
            )}
            {timeFive && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Resumed:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeFive}</div>
              </Col>
            )}
            {timeSix && (
              <Col xs={6} md={4} className="mb-2">
                <small className={`${theme === 'light' ? 'text-muted' : 'text-light-muted'}`}>Finished:</small>
                <div className={`fw-bold ${theme === 'light' ? 'text-dark' : 'text-light'}`}>{timeSix}</div>
              </Col>
            )}
          </Row>
        )}

        {/* Action Buttons */}
        <div className="text-end mt-4">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={clearInputs}
            className={`mx-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
          >
            Reset Day
          </Button>
        </div>
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
              <TodayTrackerResultText
                label="Break time"
                value={totalBreakTime}
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default TodayTracker;
