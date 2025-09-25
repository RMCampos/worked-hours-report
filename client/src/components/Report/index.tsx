import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { months, years } from './data';
import { IdAndValue } from '../../types/IdAndValue';
import { getDayExtension, getDayOfTheWeek, getLastPeriod, getMonthName } from '../../date-service';
import { DailyReport } from '../../types/dailyReport';
import { TodayTrackerStore } from '../../types/todayTrackerStore';
import { calculateWorkedHours, calculateBreakTime, formatMinutes, getHourMinuteLeftArrayFromMinutes, parseTimeToPST } from '../../hours-service';
import { useTheme } from '../../context/themeContext';
import { AuthContext } from '../../context/authContext';
import { getAllTimesForUserAndPeriod, getMonthAmountForUserAndPeriod } from '../../storage-service/server';
import { MonthAmount } from '../../types/monthAmount';
import { useMessage } from '../../context/MessageContext';
import { getError } from '../../services/ErrorService';
import DownloadJsonButton from '../DownloadJsonButton';
import JsonFileUploader from '../JsonFileUploader';

/**
 * Renders the Report component.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function Report(): React.ReactNode {
  const [selectedMonthId, setSelectedMonthId] = useState<number>(new Date().getMonth());
  const [selectedYearId, setSelectedYearId] = useState<number>(new Date().getFullYear());
  const [reportData, setReportData] = useState<DailyReport[]>([]);
  const [enableExport, setEnableExport] = useState<boolean>(false);
  const [enableImport, setEnableImport] = useState<boolean>(false);
  const [jsonDataToDownload, setJsonDataToDownload] = useState<DailyReport[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [lastMonthAmountTxt, setLastMonthAmountTxt] = useState<string>('');
  const { theme } = useTheme();
  const { username } = useContext(AuthContext);
  const { showMessage, hideMessage } = useMessage();

  /**
   * Loads the report for the current period.
   */
  const loadCurrentPeriod = (): void => {
    const date = new Date();
    setSelectedMonthId(date.getMonth());
    setSelectedYearId(date.getFullYear());
    setEnableExport(false);
  };

  /**
   * Loads the report for the selected period (month and year).
   */
  const loadSelectedPeriod = async (): Promise<void> => {
    if (isNaN(selectedMonthId) || !selectedYearId) {
      return;
    }

    if (!username) {
      return;
    }

    try {
      showMessage('loading', 'Fetching data...');

      const monthYearKey = `${selectedYearId}/${selectedMonthId}`;

      // Get amount from last month
      const lastPeriod = getLastPeriod(selectedMonthId, selectedYearId);
      const previousAmountObj: MonthAmount = await getMonthAmountForUserAndPeriod(username, lastPeriod);
      let previousAmountMinutes = previousAmountObj.amount;

      const toDisplay = formatMinutes(previousAmountObj.amount);
      setLastMonthAmountTxt(`Extra hours from last month: ${toDisplay}`);

      // const datesToSearch = (selectedMonthId, selectedYearId);
      const monthlyTracker = await getAllTimesForUserAndPeriod(username, monthYearKey);
      const reportDataToSet: DailyReport[] = [];

      monthlyTracker.forEach((theDay: TodayTrackerStore) => {
        const totalWorked: number[] = calculateWorkedHours([
          theDay.time1,
          theDay.time2,
          theDay.time3,
          theDay.time4,
          theDay.time5,
          theDay.time6
        ]);

        if (totalWorked[0] >= 8) {
          const hourToAdd = (totalWorked[0] - 8);
          const minutesToAdd = totalWorked[1];

          previousAmountMinutes += (hourToAdd * 60) + minutesToAdd;
        }
        else {
          // find the time left
          const leftArray = getHourMinuteLeftArrayFromMinutes(totalWorked[1] + (totalWorked[0] * 60));
          const minutesLeft = leftArray[1] + (leftArray[0] * 60);
          previousAmountMinutes -= minutesLeft;
        }

        // Total worked
        const totalWorkedText = `${totalWorked[0]}h ${totalWorked[1]}m`;

        // Report format
        let lastStop = theDay.time1;
        if (theDay.time6) {
          lastStop = theDay.time6;
        }
        else if (theDay.time5) {
          lastStop = theDay.time5;
        }
        else if (theDay.time4) {
          lastStop = theDay.time4;
        }
        else if (theDay.time3) {
          lastStop = theDay.time3;
        }
        else if (theDay.time2) {
          lastStop = theDay.time2;
        }
        const reportFmt = `${parseTimeToPST(theDay.time1, 4)} - ${parseTimeToPST(lastStop, 4)} - PST`;

        // Calculate break time for this day
        const timeValues: string[] = [theDay.time1, theDay.time2, theDay.time3, theDay.time4, theDay.time5, theDay.time6].filter(Boolean);
        const breakTime: number[] = calculateBreakTime(timeValues);
        const breakTimeText = `${breakTime[0]}h ${breakTime[1]}m`;

        reportDataToSet.push({
          dayOfMonth: theDay.day,
          started1: theDay.time1,
          stopped1: theDay.time2,
          started2: theDay.time3,
          stopped2: theDay.time4,
          started3: theDay.time5,
          stopped3: theDay.time6,
          worked: totalWorkedText,
          breakTime: breakTimeText,
          extra: formatMinutes(previousAmountMinutes),
          report: reportFmt
        });
      });

      // Display the data
      if (reportDataToSet) {
        setReportData(reportDataToSet);
      }
      else {
        setReportData([]);
      }

      // Check if should export data
      if (enableExport && reportDataToSet) {
        setJsonDataToDownload(reportDataToSet);
        setFilename(`month${selectedMonthId}-year${selectedYearId}.json`);
      }

      hideMessage();
    }
    catch (error) {
      showMessage('error', getError(error));
    }
  };

  /**
   * Export the selected month to a JSON file.
   */
  const exportMonthData = (): void => {
    setEnableExport(true);
  };

  /**
   * Enable the import input to show up.
   */
  const importMonthData = (): void => {
    setEnableImport(true);
  };

  const handleUploadedJson = (content: string): void => {
    setEnableImport(false);
    const jsonData = JSON.parse(content);

    for (let i = 0, len = jsonData.length; i < len; i++) {
      const jsonObj = jsonData[i];
      const { dayOfMonth } = jsonObj;
      const objToSave: TodayTrackerStore = {
        day: dayOfMonth,
        time1: jsonObj.started1,
        time2: jsonObj.stopped1,
        time3: jsonObj.started2,
        time4: jsonObj.stopped2,
        time5: jsonObj.started3,
        time6: jsonObj.stopped3,
        totalWorkedHours: jsonObj.worked,
        totalBreakTime: jsonObj.breakTime || '0h 0m',
        willCompleteAt: '',
        timeLeft: '',
        extraHours: jsonObj.extra,
        documentId: null
      };

      console.debug(objToSave);
      // TODO: create a save all method
    }
  };

  const getDayText = (date: string): string => {
    const parts: string[] = date.split('/');
    const year: number = parseInt(parts[0]);
    const month: number = parseInt(parts[1]);
    const day: number = parseInt(parts[2]);
    const theDay = new Date(year, month, day);

    const dayParts: string[] = [];
    dayParts.push(getDayOfTheWeek(theDay.getDay()));
    dayParts.push(', ');
    dayParts.push(getMonthName(theDay.getMonth()));
    dayParts.push(' ');
    dayParts.push(theDay.getDate().toString());
    dayParts.push(getDayExtension(theDay.getDate()));
    dayParts.push(', ');
    dayParts.push(theDay.getFullYear().toString());

    return dayParts.join('');
  };

  useEffect(() => {
    loadSelectedPeriod();
  }, [selectedMonthId, selectedYearId, enableExport, enableImport]);

  useEffect(() => {}, [lastMonthAmountTxt]);

  return (
    <div className={`card p-4 shadow-sm mb-4 ${theme === 'light' ? 'text-bg-light' : 'card-bg-dark'}`}>
      <h1 className={`my-4 ${theme === 'light' ? 'text-dark' : 'text-light'}`}>Monthly Report</h1>

      <Row>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="Default select example"
            value={selectedMonthId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              if (event.target.value) {
                setSelectedMonthId(parseInt(event.target.value));
              }
            }}
          >
            <option>Select a month</option>
            {months.map((theMonth: IdAndValue) => (
              <option
                key={theMonth.id}
                value={theMonth.id}
              >
                {theMonth.value}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="Default select example"
            value={selectedYearId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              if (event.target.value) {
                setSelectedYearId(parseInt(event.target.value));
              }
            }}
          >
            <option>Select the year</option>
            {years.map((theYear: IdAndValue) => (
              <option key={theYear.id} value={theYear.id}>{theYear.value}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={6} className="text-center">
          <Button
            variant="outline-secondary"
            type="button"
            className={`ms-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            onClick={loadCurrentPeriod}
          >
            Load current
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            className={`ms-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            onClick={loadSelectedPeriod}
          >
            Reload
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mt-3">
          <small className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>{lastMonthAmountTxt}</small>
          <Table bordered hover>
            <thead>
              <tr className="sticky-top">
                <th scope="col">Day of Month</th>
                <th scope="col">Started</th>
                <th scope="col">Stopped</th>
                <th scope="col">Started</th>
                <th scope="col">Stopped</th>
                <th scope="col">Started</th>
                <th scope="col">Stopped</th>
                <th scope="col">Total</th>
                <th scope="col">Extra (Sum)</th>
                <th scope="col">Report</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((dailyItem: DailyReport) => (
                <tr key={dailyItem.dayOfMonth}>
                  <td scope="row">
                    {getDayText(dailyItem.dayOfMonth)}
                  </td>
                  <td>
                    {dailyItem.started1}
                  </td>
                  <td>
                    {dailyItem.stopped1}
                  </td>
                  <td>
                    {dailyItem.started2}
                  </td>
                  <td>
                    {dailyItem.stopped2}
                  </td>
                  <td>
                    {dailyItem.started3}
                  </td>
                  <td>
                    {dailyItem.stopped3}
                  </td>
                  <td>
                    {dailyItem.worked}
                  </td>
                  <td>
                    {dailyItem.extra}
                  </td>
                  <td>
                    {dailyItem.report}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button
            variant="outline-secondary"
            type="button"
            className={`my-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            onClick={exportMonthData}
          >
            Export month data
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            className={`my-2 ms-2 ${theme === 'dark' ? 'btn-lighter' : 'btn-darker'}`}
            onClick={importMonthData}
          >
            Import month data
          </Button>

          {enableExport && (
            <DownloadJsonButton jsonData={jsonDataToDownload} filename={filename} />
          )}

          {enableImport && (
            <JsonFileUploader onJsonUploaded={handleUploadedJson} maxSizeMB={5} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Report;
