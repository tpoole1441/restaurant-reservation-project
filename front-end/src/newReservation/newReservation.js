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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
