import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, updateReservation } from "../utils/api";

function ReservationForm({ initialData = {}, isEdit = false }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    ...initialData,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      ...initialData,
    }));
  }, [initialData]);

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
    const openingTime = new Date(`${formData.reservation_date}T16:30:00.000Z`);
    const closingTime = new Date(`${formData.reservation_date}T21:30:00.000Z`);

    const errors = [];
    if (reservationDateTime < currentDateTime) {
      errors.push(
        "The reservation time cannot be in the past. Please choose a future time."
      );
    }

    if (
      reservationDateTime < openingTime ||
      reservationDateTime > closingTime
    ) {
      errors.push("Reservation time must be between 16:30 and 21:30.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    setError(null);

    try {
      if (isEdit) {
        await updateReservation(formData.reservation_id, formData);
      } else {
        await createReservation(formData);
      }
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.error("Error saving reservation:", error);
      setError(error.message);
    }
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          className="form-control"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          className="form-control"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number</label>
        <input
          type="tel"
          className="form-control"
          id="mobile_number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_date">Reservation Date</label>
        <input
          type="date"
          className="form-control"
          id="reservation_date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_time">Reservation Time</label>
        <input
          type="time"
          className="form-control"
          id="reservation_time"
          name="reservation_time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="people">People</label>
        <input
          type="number"
          className="form-control"
          id="people"
          name="people"
          value={formData.people}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleGoBack}
      >
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
