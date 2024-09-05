import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

function NewReservation() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reservationDateTime = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000Z`
    );
    reservationDateTime.setHours(reservationDateTime.getHours() + 5);
    const currentDateTime = new Date();
    const openingTime = new Date(`${formData.reservation_date}T10:30:00.000Z`);
    const closingTime = new Date(`${formData.reservation_date}T21:30:00.000Z`);

    const errors = [];

    // Check if reservation is on a Tuesday
    if (reservationDateTime.getUTCDay() === 2) {
      errors.push(
        "The restaurant is closed on Tuesdays. Please choose a different date."
      );
    }

    // Check if reservation time is between 10:30 AM and 9:30 PM
    if (
      reservationDateTime < openingTime ||
      reservationDateTime > closingTime
    ) {
      errors.push("The reservation time must be between 10:30 AM and 9:30 PM.");
    }

    // Check if reservation date is in the past
    if (reservationDateTime < currentDateTime) {
      errors.push(
        "The reservation time cannot be in the past. Please choose a future time."
      );
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    setError(null);

    try {
      await createReservation(formData);
      history.push(`/dashboard/?date=${formData.reservation_date}`);
    } catch (error) {
      console.error("Error creating new reservation:", error);
    }
  };

  const handleGoBack = async () => {
    history.goBack();
  };

  return (
    <main>
      <h1>New Reservation</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <br />
        <input
          type="text"
          id="first_name"
          name="first_name"
          onChange={handleChange}
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
    </main>
  );
}

export default NewReservation;
