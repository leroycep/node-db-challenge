const express = require("express");

const model = require("./data/model.js");
const PORT = process.env.PORT || 44794;

const server = express();

server.use(express.json());

server.get("/api/projects", (req, res) => {
  model
    .projects()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to retrieve projects" });
    });
});

server.post("/api/projects", hasNameField, (req, res) => {
  model
    .addProject(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add project" });
    });
});

server.get("/api/resources", (req, res) => {
  model
    .resources()
    .then((resources) => {
      res.status(200).json(resources);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to retrieve resources" });
    });
});

server.post("/api/resources", hasNameField, (req, res) => {
  model
    .addResource(req.body)
    .then((resource) => {
      res.status(201).json(resource);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add resource" });
    });
});

server.post(
  "/api/projects/:id/tasks",
  validateProjectId,
  hasDescriptionField,
  (req, res) => {
    model
      .addTask(req.project.id, req.body)
      .then((task) => {
        res.status(201).json(task);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Failed to add task" });
      });
  }
);

server.post("/api/projects/:id/resources", validateProjectId, (req, res) => {
  model
    .addResourceToProject(req.project.id, req.body.resource_id)
    .then((project_resources) => {
      res.status(200).json(project_resources);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add resource to project" });
    });
});

server.get("/api/projects/:id", validateProjectId, (req, res) => {
  model
    .projectTasks(req.project.id)
    .then((tasks) => {
      model
        .projectResources(req.project.id)
        .then((resources) => {
          res.status(200).json({ ...req.project, tasks, resources });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ message: "Failed to retrieve project's resources" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to retrieve project's tasks" });
    });
});

server.get(
  "/api/projects/:id/tasks/:task_id",
  validateProjectId,
  (req, res) => {
    model
      .projectTaskById(req.project.id, req.params.task_id)
      .then((task) => {
        if (task) {
          model
            .contextsByTaskId(task.id)
            .then((contexts) => res.status(200).json({ ...task, contexts }));
        } else {
          res
            .status(404)
            .json({ message: "No task with the specified for this project" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Failed to retrieve project's tasks" });
      });
  }
);

server.post("/api/tasks/:id/contexts", (req, res) => {
  model
    .addContextToTask(req.params.id, req.body.context_id)
    .then((task_contexts) => {
      res.status(200).json(task_contexts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add context" });
    });
});

server.post("/api/contexts", hasNameField, (req, res) => {
  model
    .addContext(req.body)
    .then((context) => {
      res.status(201).json(context);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add context" });
    });
});

server.get("/api/contexts", (req, res) => {
  model
    .contexts()
    .then((contexts) => {
      res.status(200).json(contexts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to retrieve contexts" });
    });
});

function hasNameField(req, res, next) {
  if (req.body.name === undefined) {
    res.status(400).json({ message: "must have a name" });
    return;
  }
  next();
}

function hasDescriptionField(req, res, next) {
  if (req.body.description === undefined) {
    res.status(400).json({ message: "must have a description" });
    return;
  }
  next();
}

function validateProjectId(req, res, next) {
  model
    .projectById(req.params.id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: "No project with the specified id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to retrieve project" });
    });
}

server.listen(PORT, () =>
  console.log(` == server listening on port ${PORT} == `)
);
