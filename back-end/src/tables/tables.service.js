const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: reservation_id })
    .returning(["*"])
    .then((updatedRecords) => updatedRecords[0]);
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function deleteReservation(table_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  read,
  readReservation,
  update,
  create,
  deleteReservation,
};
