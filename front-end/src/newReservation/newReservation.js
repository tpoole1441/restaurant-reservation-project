import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function NewReservation() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // TODO update handleSubmit to actually submit data to API
      console.log(formData);
      history.push(`/dashboard/${formData.reservation_date}`);
    } catch (error) {
      console.error("Error creating new reservation:", error);
    }
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
          pattern="[0-9]{10}"
          onChange={handleChange}
          required
        ></input>
        <br />
        <label>Reservation Date</label>
        <br />
        <input
          type="date"
          id="reservation_date"
          name="reservation_date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}\d{2}"
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
        <button type="submit" className="btn btn-primary my-3 mr-3">
          Submit
        </button>
        {/* TODO set Link to previous page instead of dashboard  */}
        <Link to="/dashboard" className="btn btn-secondary my-3">
          Cancel
        </Link>
      </form>
    </main>
  );
}

export default NewReservation;
