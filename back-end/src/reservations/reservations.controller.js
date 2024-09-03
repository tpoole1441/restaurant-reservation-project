const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  const data = await reservationsService.list(date);
  return res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
