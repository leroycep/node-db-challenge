const db = require("./db-config.js");

module.exports = {
  projects,
};

function projects() {
  return db("projects").select();
}
