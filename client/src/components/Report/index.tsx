import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { months, years } from './data';
import { IdAndValue } from '../../types/IdAndValue';
import { createDayArrayForMonthYear } from '../../date-service';
import { DailyReport } from '../../types/dailyReport';
import { TodayTrackerStore } from '../../types/todayTrackerStore';
import { loadTrackerForDate } from '../../storage-service/storage';
import { calculateWorkedHours } from '../../hours-service';

function Report(): React.ReactNode {
  const [selectedMonthId, setSelectedMonthId] = useState<number>(0);
  const [selectedYearId, setSelectedYearId] = useState<number>(2025);
  const [reportData, setReportData] = useState<DailyReport[]>([]);

  const loadSelectedPeriod = (): void => {
    if (isNaN(selectedMonthId) || !selectedYearId) {
      return;
    }
    console.log('Go!');

    const datesToSearch = createDayArrayForMonthYear(selectedMonthId, selectedYearId);
    const reportDataToSet: DailyReport[] = [];
    let hourSum = 0;
    let minuteSum = 0;

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
          hourSum += (totalWorkd[0] - 8);
          minuteSum += totalWorkd[1];
        }
        else {
          // find the time left
          let minutesLeft = (8 - totalWorkd[0]) * 60;
          minutesLeft -= totalWorkd[1];

          while (minutesLeft >= 60) {
            hourSum -= 1;
            minutesLeft -= 60;
          }
          minuteSum -= minutesLeft;
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
          extra: `${hourSum}h ${minuteSum}m`
        });
      }
    });

    if (reportDataToSet) {
      setReportData(reportDataToSet);
    }
  };

  useEffect(() => {
    //
  }, [reportData]);

  return (
    <>
      <h1>Monthly Report</h1>

      <span>Period:</span>
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
            variant="primary"
            type="button"
            onClick={loadSelectedPeriod}
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
    </>
  );
}

export default Report;
