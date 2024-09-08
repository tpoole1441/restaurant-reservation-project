import React from "react";
import { searchReservations, reservationStatusUpdate } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

function Search() {
  const [mobile_number, setMobile_number] = React.useState("");
  const [reservations, setReservations] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [searched, setSearched] = React.useState(false);

  const handleChange = ({ target }) => {
    setMobile_number(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await searchReservations(
        mobile_number,
        abortController.signal
      );
      setReservations(response);
      setSearched(true);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmCancel) {
      const abortController = new AbortController();
      await reservationStatusUpdate(
        reservation_id,
        "cancelled",
        abortController.signal
      );
      const response = await searchReservations(mobile_number);
      setReservations(response);
      setSearched(true);
    } else {
      // should do nothing
    }
  };

  return (
    <main>
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            className="form-control"
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            value={mobile_number}
            placeholder="Enter a customer's phone number"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mb-3">
          Find
        </button>
      </form>
      <div>
        {error && <div className="alert alert-danger">{error}</div>}
        {searched && reservations.length > 0 ? (
          reservations.map(
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {first_name} {last_name} - {mobile_number}
                    </span>
                    <span className="small">Party size: {people}</span>
                  </h3>
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
          )
        ) : searched ? (
          <h4>No reservations found</h4>
        ) : null}
      </div>
    </main>
  );
}

export default Search;
