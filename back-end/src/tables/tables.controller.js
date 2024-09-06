const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  if (!table_id) {
    return next({
      status: 400,
      message: `table_id is missing.`,
    });
  }
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id} cannot be found.`,
  });
}

async function reservationExists(req, res, next) {
  const data = req.body.data;
  if (!data) {
    return next({
      status: 400,
      message: `data is missing.`,
    });
  }
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: `reservation_id is missing.`,
    });
  }
  const reservation = await tablesService.readReservation(data.reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${data.reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

async function verifyCapacity(req, res, next) {
  const { table } = res.locals;
  const { reservation } = res.locals;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Table capacity is too small for this reservation.`,
    });
  }
  next();
}

function isTableOccupied(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table is already occupied.`,
    });
  }
  next();
}

async function update(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = req.body.data;
  const data = await tablesService.update(table_id, reservation_id);
  res.status(200).json({ data });
}

async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  if (!data) {
    return next({
      status: 400,
      message: "Table cannot be created.",
    });
  }
  res.status(201).json({ data });
}

function tableNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name must be at least 2 characters long.`,
    });
  }
  next();
}

function capacityIsNumber(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: `capacity must be a number.`,
    });
  }
  next();
}

async function deleteTableReservation(req, res) {
  const { table_id } = res.locals.table;
  await tablesService.deleteReservation(table_id);
  res.status(200).json({ data: { table_id } });
}

function isTableNotOccupied(req, res, next) {
  const { table } = res.locals;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table is not occupied.`,
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    isTableOccupied,
    asyncErrorBoundary(verifyCapacity),
    asyncErrorBoundary(update),
  ],
  create: [
    hasRequiredProperties,
    tableNameLength,
    capacityIsNumber,
    asyncErrorBoundary(create),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isTableNotOccupied,
    asyncErrorBoundary(deleteTableReservation),
  ],
};
