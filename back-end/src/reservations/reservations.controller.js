const { useParams } = require("react");

async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
