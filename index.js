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

function hasNameField(req, res, next) {
  if (req.body.name === undefined) {
    res.status(400).json({ message: "must have a name" });
    return;
  }
  next();
}

server.listen(PORT, () =>
  console.log(` == server listening on port ${PORT} == `)
);
