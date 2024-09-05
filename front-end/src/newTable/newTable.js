import React from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function NewTable() {
  const history = useHistory();
  const initialFormData = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = React.useState({ ...initialFormData });
  const [error, setError] = React.useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const table = {
      data: { ...formData },
    };
    try {
      await createTable(table, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <h1>New Table</h1>
      {/* <ErrorAlert error={error} /> */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table Name:</label>
        <br />
        <input
          id="table_name"
          type="text"
          name="table_name"
          onChange={handleChange}
          value={formData.table_name}
          minLength="2"
          required
        />
        <br />
        <label htmlFor="capacity">Capacity:</label>
        <br />
        <input
          id="capacity"
          type="number"
          name="capacity"
          onChange={handleChange}
          value={formData.capacity}
          min="1"
          required
        />
        <br />
        <button type="submit" className="btn btn-primary my-3">
          Submit
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-secondary m-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default NewTable;
