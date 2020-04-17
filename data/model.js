const db = require("./db-config.js");

module.exports = {
  projects,
  addProject,
  resources,
  addResource,
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

function resources() {
  return db("resources").select();
}

function addResource(resource) {
  return db("resources")
    .insert(resource, "id")
    .then((resources_ids) =>
      db("resources").select().where({ id: resources_ids[0] }).first()
    );
}
