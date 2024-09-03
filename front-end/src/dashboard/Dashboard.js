import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const dateFromQuery = queryParams.get("date");
  const [currentDate, setCurrentDate] = useState(dateFromQuery || today());

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const setDateToday = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
    setCurrentDate(today());
  };

  const setDatePrevious = (event) => {
    event.preventDefault();
    const previousDate = previous(currentDate);
    history.push(`/dashboard?date=${previousDate}`);
    setCurrentDate(previousDate);
  };

  const setDateNext = (event) => {
    event.preventDefault();
    const nextDate = next(currentDate);
    history.push(`/dashboard?date=${nextDate}`);
    setCurrentDate(nextDate);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <div>
        <button onClick={setDatePrevious} className="btn btn-secondary my-3">
          Previous
        </button>
        <button onClick={setDateToday} className="btn btn-primary m-3">
          Today
        </button>
        <button onClick={setDateNext} className="btn btn-secondary my-3">
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
