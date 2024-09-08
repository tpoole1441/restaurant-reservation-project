import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { findReservation, updateReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState({ status: "booked" });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  useEffect(() => {
    const abortController = new AbortController();
    findReservation(reservation_id, abortController.signal)
      .then((response) => {
        setReservation(response);
        setFormData({
          first_name: response.first_name,
          last_name: response.last_name,
          mobile_number: response.mobile_number,
          reservation_date: response.reservation_date,
          reservation_time: formatAsTime(response.reservation_time),
          people: response.people,
        });
      })
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

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
      await updateReservation(reservation_id, formData);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.error("Error creating new reservation:", error);
    }
  };

  const handleGoBack = async () => {
    history.goBack();
  };

  return (
    <main>
      <h1>Edit Reservation</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleGoBack={handleGoBack}
        formData={formData}
        reservation={reservation}
      />
    </main>
  );
}

export default EditReservation;
