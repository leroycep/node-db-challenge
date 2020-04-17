const db = require("./db-config.js");

module.exports = {
  projects,
  projectById,
  projectTasks,
  projectResources,
  projectTaskById,
  addProject,
  resources,
  addResource,
  addResourceToProject,
  addTask,
  contexts,
  contextsByTaskId,
  addContext,
  addContextToTask,
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

function projectResources(id) {
  return db("project_resources")
    .select("project_resources.id", "resources.name", "resources.description")
    .join("resources", { "resources.id": "project_resources.project_id" })
    .where({ project_id: id });
}

function projectTaskById(project_id, task_id) {
  return db("tasks")
    .select("id", "description", "notes", "completed")
    .where({ id: task_id, project_id })
    .first();
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

function addResourceToProject(project_id, resource_id) {
  return db("project_resources")
    .insert({ project_id, resource_id }, "id")
    .then((project_resource_ids) => projectResources(project_resource_ids[0]));
}

function addTask(project_id, task) {
  return db("tasks")
    .insert({ ...task, project_id }, "id")
    .then((task_ids) =>
      db("tasks").select().where({ id: task_ids[0] }).first()
    );
}

function contexts() {
  return db("contexts").select();
}

function contextsByTaskId(task_id) {
  return db("task_contexts")
    .select("task_id", "context_id", "contexts.name as context_name")
    .where({ task_id })
    .join("contexts", { "contexts.id": "task_contexts.context_id" });
}

function addContext(context) {
  return db("contexts")
    .insert(context, "id")
    .then((context_ids) =>
      db("contexts").select().where({ id: context_ids[0] }).first()
    );
}

function addContextToTask(task_id, context_id) {
  return db("task_contexts")
    .insert({ task_id, context_id }, "id")
    .then((task_context_ids) => contextsByTaskId(task_id));
}
