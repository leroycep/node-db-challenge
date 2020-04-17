const db = require("./db-config.js");

module.exports = {
  projects,
  projectById,
  projectTasks,
  addProject,
  resources,
  addResource,
  addTask,
};

function projects() {
  return db("projects").select();
}

function projectById(id) {
  return db("projects").select().where({ id }).first();
}

function projectTasks(id) {
  return db("tasks")
    .select("id", "description", "notes", "completed")
    .where({ project_id: id });
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

function addTask(project_id, task) {
  return db("tasks")
    .insert({ ...task, project_id }, "id")
    .then((task_ids) =>
      db("tasks").select().where({ id: task_ids[0] }).first()
    );
}
