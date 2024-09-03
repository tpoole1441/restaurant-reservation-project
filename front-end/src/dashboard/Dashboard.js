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
  const [date, setDate] = useState(dateFromQuery || today());

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const setDateToday = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
    setDate(today());
  };

  const setDatePrevious = (event) => {
    event.preventDefault();
    const previousDate = previous(date);
    history.push(`/dashboard?date=${previousDate}`);
    setDate(previousDate);
  };

  const setDateNext = (event) => {
    event.preventDefault();
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
    setDate(nextDate);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
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
      {reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people,
        }) => (
          <div className="card my-3" key={reservation_id}>
            <div className="card-body">
              <h3 className="card-title">
                {first_name} {last_name} - {people}
              </h3>
              <p className="card-text">Mobile number: {mobile_number}</p>
              <p className="card-text">Reservation Date: {reservation_date}</p>
              <p className="card-text">Reservation Time: {reservation_time}</p>
            </div>
          </div>
        )
      )}
    </main>
  );
}

export default Dashboard;
