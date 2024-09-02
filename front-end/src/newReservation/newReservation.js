import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

function NewReservation() {
  //   const navigate = useNavigate();
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
      console.log(formData);
      //   navigate(`/dashboard/${formData.reservation_date}`);
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default NewReservation;
