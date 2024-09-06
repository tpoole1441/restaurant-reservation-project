const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// import { next } from ("../../../front-end/src/utils/date-time");
const e = require("express");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function isValidTime(timeString) {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(timeString);
}

function isValidNumber(value) {
  return Number.isInteger(value) && value > 0;
}

function validateReservationData(req, res, next) {
  const { data = {} } = req.body;

  const { reservation_date, reservation_time, people } = data;

  if (!isValidDate(reservation_date)) {
    return next({
      status: 400,
      message: `Invalid reservation_date: ${reservation_date}`,
    });
  }

  if (!isValidTime(reservation_time)) {
    return next({
      status: 400,
      message: `Invalid reservation_time: ${reservation_time}`,
    });
  }

  if (!isValidNumber(people)) {
    return next({
      status: 400,
      message: `Invalid people count: ${people}`,
    });
  }

  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}:00Z`
  );
  const currentDateTime = new Date();
  currentDateTime.setHours(currentDateTime.getHours() - 5);
  const openingTime = new Date(`${reservation_date}T10:30:00.000Z`);
  const closingTime = new Date(`${reservation_date}T21:30:00.000Z`);

  // Check if reservation is on a Tuesday
  if (reservationDateTime.getUTCDay() === 2) {
    return next({
      status: 400,
      message:
        "The restaurant is closed on Tuesdays. Please choose a different date.",
    });
  }

  // Check if reservation time is between 10:30 AM and 9:30 PM
  if (reservationDateTime < openingTime || reservationDateTime > closingTime) {
    return next({
      status: 400,
      message: "The reservation time must be between 10:30 AM and 9:30 PM.",
    });
  }

  // Check if reservation date is in the past
  if (reservationDateTime < currentDateTime) {
    return next({
      status: 400,
      message:
        "The reservation date cannot be in the past. Please choose a future date.",
    });
  }

  next();
}

async function list(req, res, next) {
  const { date } = req.query;
  if (!date) {
    const data = await reservationsService.listAll();
    return res.json({ data });
  }
  try {
    const data = await reservationsService.list(date);
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    validateReservationData,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
