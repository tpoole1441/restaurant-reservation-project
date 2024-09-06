import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable, listAllReservations } from "../utils/api";

function ReservationsSeat() {
  const history = useHistory();
  const [tables, setTables] = React.useState([]);
  const [error, setError] = React.useState(null);
  const { reservation_id } = useParams();
  const [reservations, setReservations] = React.useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    listAllReservations(abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }, []);

  const handleSeatReservation = () => {
    const selectedTableId = document.querySelector(
      'select[name="table_id"]'
    ).value;

    const reservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(reservation_id)
    );

    const selectedTable = tables.find(
      (table) => table.table_id === Number(selectedTableId)
    );

    if (selectedTable && selectedTable.capacity < reservation.people) {
      setError("Table capacity is too small for this reservation.");
      return;
    }

    const requestBody = {
      data: {
        reservation_id: reservation_id,
      },
    };

    updateTable(selectedTableId, requestBody)
      .then(() => {
        history.push("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <main>
      <h1>Reservations Seat</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <select name="table_id">
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleSeatReservation} className="btn btn-primary my-3">
        Submit
      </button>
      <button onClick={handleCancel} className="btn btn-secondary m-3">
        Cancel
      </button>
    </main>
  );
}

export default ReservationsSeat;
