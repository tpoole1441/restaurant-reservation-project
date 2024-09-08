import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

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
  const reservation = { status: "booked" };

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
    closingTime.setHours(closingTime.getHours() + 5);

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
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleGoBack={handleGoBack}
        reservation={reservation}
      />
    </main>
  );
}

export default NewReservation;
