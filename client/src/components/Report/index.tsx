import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { months, years } from './data';
import { IdAndValue } from '../../types/IdAndValue';
import { createDayArrayForMonthYear, getLastPeriod } from '../../date-service';
import { DailyReport } from '../../types/dailyReport';
import { TodayTrackerStore } from '../../types/todayTrackerStore';
import { loadAmountForPeriod, loadTrackerForDate, saveAmountForPeriod } from '../../storage-service/storage';
import { calculateWorkedHours, formatMinutes, getHourMinuteLeftArrayFromMinutes } from '../../hours-service';
import { useTheme } from '../../context/themeContext';
import { PeriodAmount } from '../../types/periodAmount';

function Report(): React.ReactNode {
  const [selectedMonthId, setSelectedMonthId] = useState<number>(0);
  const [selectedYearId, setSelectedYearId] = useState<number>(2025);
  const [reportData, setReportData] = useState<DailyReport[]>([]);
  const { theme } = useTheme();

  const loadCurrentPeriod = (): void => {
    const date = new Date();
    setSelectedMonthId(date.getMonth());
    setSelectedYearId(date.getFullYear());
  };

  const loadSelectedPeriod = (): void => {
    if (isNaN(selectedMonthId) || !selectedYearId) {
      return;
    }

    // Get amount from last month
    const lastPeriod = getLastPeriod(selectedMonthId, selectedYearId);
    let previousAmountMinutes = loadAmountForPeriod(lastPeriod);
    console.log('previousAmountMinutes', previousAmountMinutes);

    const datesToSearch = createDayArrayForMonthYear(selectedMonthId, selectedYearId);
    const reportDataToSet: DailyReport[] = [];

    datesToSearch.forEach((theDay: string) => {
      const reportForDate: TodayTrackerStore | undefined = loadTrackerForDate(theDay);
      if (reportForDate) {
        const totalWorkd: number[] = calculateWorkedHours([
          reportForDate.time1,
          reportForDate.time2,
          reportForDate.time3,
          reportForDate.time4,
          reportForDate.time5,
          reportForDate.time6
        ]);

        if (totalWorkd[0] >= 8) {
          const hourToAdd = (totalWorkd[0] - 8);
          const minutesToAdd = totalWorkd[1];

          previousAmountMinutes += (hourToAdd * 60) + minutesToAdd;
        }
        else {
          // find the time left
          const leftArray = getHourMinuteLeftArrayFromMinutes(totalWorkd[1] + (totalWorkd[0] * 60));
          const minutesLeft = leftArray[1] + (leftArray[0] * 60);
          previousAmountMinutes -= minutesLeft;
        }

        // Total worked
        const totalWorkedText = `${totalWorkd[0]}h ${totalWorkd[1]}m`;

        reportDataToSet.push({
          dayOfMonth: theDay,
          started1: reportForDate.time1,
          stopped1: reportForDate.time2,
          started2: reportForDate.time3,
          stopped2: reportForDate.time4,
          started3: reportForDate.time5,
          stopped3: reportForDate.time6,
          worked: totalWorkedText,
          extra: formatMinutes(previousAmountMinutes)
        });
      }
    });

    if (reportDataToSet) {
      setReportData(reportDataToSet);
    }

    // Save final amount for the period
    const periodAmount: PeriodAmount = {
      period: `${selectedYearId}/${selectedMonthId}`,
      amountOfMinutes: previousAmountMinutes
    };

    saveAmountForPeriod(periodAmount);
  };

  useEffect(() => {
    loadSelectedPeriod();
  }, [selectedMonthId, selectedYearId]);

  return (
    <div className={`card p-4 shadow-sm mb-4 ${theme === 'light' ? 'text-bg-light' : 'card-bg-dark'}`}>
      <h1 className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>Monthly Report</h1>

      <span className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>Period:</span>
      <Row>
        <Col xs={4}>
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
        <Col xs={4}>
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
        <Col xs={4}>
          <Button
            variant="outline-secondary"
            type="button"
            className="ms-2 w-100"
            onClick={loadCurrentPeriod}
          >
            Load current
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mt-3">
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
              </tr>
            </thead>
            <tbody>
              {reportData.map((dailyItem: DailyReport) => (
                <tr key={dailyItem.dayOfMonth}>
                  <td scope="row">
                    {dailyItem.dayOfMonth}
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
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

export default Report;
