import React from "react";

function ReservationForm({
  reservation,
  formData,
  handleChange,
  handleSubmit,
  handleGoBack,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <label>First Name</label>
      <br />
      <input
        type="text"
        id="first_name"
        name="first_name"
        onChange={handleChange}
        value={formData.first_name}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <label>Last Name</label>
      <br />
      <input
        type="text"
        id="last_name"
        name="last_name"
        onChange={handleChange}
        value={formData.last_name}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <label>Mobile Number</label>
      <br />
      <input
        type="text"
        id="mobile_number"
        name="mobile_number"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        placeholder="555-555-5555"
        onChange={handleChange}
        value={formData.mobile_number}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <label>Reservation Date</label>
      <br />
      <input
        type="text"
        id="reservation_date"
        name="reservation_date"
        placeholder="YYYY-MM-DD"
        pattern="\d{4}-\d{2}-\d{2}"
        onChange={handleChange}
        value={formData.reservation_date}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <label>Reservation Time</label>
      <br />
      <input
        type="time"
        id="reservation_time"
        name="reservation_time"
        placeholder="HH:MM"
        pattern="[0-9]{2}:[0-9]{2}"
        onChange={handleChange}
        value={formData.reservation_time}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <label>Number of people in party</label>
      <br />
      <input
        type="number"
        id="people"
        name="people"
        onChange={handleChange}
        value={formData.people}
        disabled={reservation.status && reservation.status !== "booked"}
        required
      ></input>
      <br />
      <button type="submit" className="btn btn-primary my-3 mr-3">
        Submit
      </button>
      <button
        type="button"
        className="btn btn-secondary my-3"
        onClick={handleGoBack}
      >
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
