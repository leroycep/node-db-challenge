const db = require("./db-config.js");

module.exports = {
  projects,
  addProject,
};

function projects() {
  return db("projects").select();
}

function addProject(project) {
  return db("projects")
    .insert(project, "id")
    .then((project_ids) =>
      db("projects").select().where({ id: project_ids[0] }).first()
    );
}
