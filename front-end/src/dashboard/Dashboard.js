import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { today, previous, next, formatAsTime } from "../utils/date-time";
import {
  listReservations,
  listTables,
  deleteTable,
  reservationStatusUpdate,
} from "../utils/api";
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
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch tables:", error);
        }
      });
    return () => abortController.abort();
  }, []);

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

  const handleFinish = async (reservation_id, event) => {
    const confirmReadyToSeat = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmReadyToSeat) {
      const table_id = event.target.getAttribute("data-table-id-finish");
      await reservationStatusUpdate(reservation_id, "finished");
      await deleteTable(table_id);
      history.go(0);
    } else {
      // should do nothing
    }
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmCancel) {
      await reservationStatusUpdate(reservation_id, "cancelled");
      history.go(0);
    } else {
      // should do nothing
    }
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
      {reservations
        .filter(
          (reservation) =>
            reservation.status !== "finished" &&
            reservation.status !== "cancelled"
        )
        .map(
          ({
            reservation_id,
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            status,
            people,
          }) => (
            <div className="card my-3" key={reservation_id}>
              <div className="card-body">
                <h3
                  className="card-title"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {first_name} {last_name} - {mobile_number}
                  </span>
                  <span className="small">Party size: {people}</span>
                </h3>
                {/* <p className="card-text">Mobile number: {mobile_number}</p> */}
                <p className="card-text">Date: {reservation_date}</p>
                <p className="card-text">
                  Time: {formatAsTime(reservation_time)}
                </p>
                <p
                  className="card-text"
                  data-reservation-id-status={reservation_id}
                >
                  Status: {status}
                </p>
                {status === "booked" && (
                  <a
                    href={`/reservations/${reservation_id}/seat`}
                    className="btn btn-primary mr-3"
                  >
                    Seat
                  </a>
                )}
                <a
                  href={`/reservations/${reservation_id}/edit`}
                  className="btn btn-secondary mr-3"
                >
                  Edit
                </a>
                <button
                  type="button"
                  onClick={() => handleCancel(reservation_id)}
                  className="btn btn-danger"
                  data-reservation-id-cancel={reservation_id}
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        )}
      <div>
        <h4>Tables</h4>
        {tables.map((table) => (
          <div key={table.table_id} className={`card my-3`}>
            <div className="card-body">
              <h5
                className="card-title"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{table.table_name}</span>
                <span className="small">{table.capacity} seats</span>
              </h5>
              <p className="card-text" data-table-id-status={table.table_id}>
                Status: {table.reservation_id ? "Occupied" : "Free"}
              </p>
              {table.reservation_id && (
                <p className="card-text">
                  Reservation ID: {table.reservation_id}
                </p>
              )}
              {table.reservation_id && (
                <button
                  type="button"
                  onClick={(event) => handleFinish(table.reservation_id, event)}
                  data-table-id-finish={table.table_id}
                  className="btn btn-danger"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
