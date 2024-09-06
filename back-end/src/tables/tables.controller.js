const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id} cannot be found.`,
  });
}

async function verifyCapacity(req, res, next) {
  const { table } = res.locals;
  const { reservation_id } = req.body.data;
  const reservation = await tablesService.readReservation(reservation_id);
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Table capacity is too small for this reservation.`,
    });
  }
  next();
}

async function update(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = req.body.data;
  const data = await tablesService.update(table_id, reservation_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(verifyCapacity),
    asyncErrorBoundary(update),
  ],
};
