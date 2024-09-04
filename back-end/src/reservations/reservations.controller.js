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

  const reservationDate = new Date(reservation_date + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (reservationDate.getUTCDay() === 2) {
    return next({
      status: 400,
      message:
        "The restaurant is closed on Tuesdays. Please choose a different date.",
    });
  }

  if (reservationDate < today) {
    return next({
      status: 400,
      message:
        "The reservation date cannot be in the past. Please choose a future date.",
    });
  }

  next();
}

async function list(req, res) {
  const date = req.query.date;
  const data = await reservationsService.list(date);
  return res.json({ data });
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    validateReservationData,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
};
