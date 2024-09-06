const knex = require("../db/connection");

function list(reservation_date) {
  if (!reservation_date) {
    throw new Error("reservation_date is required.");
  }
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}

function listAll() {
  return knex("reservations").select("*").orderBy("reservation_date");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  listAll,
  create,
};
