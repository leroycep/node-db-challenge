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

server.post("/api/projects", validateProject, (req, res) => {
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

function validateProject(req, res, next) {
  if (req.body.name === undefined) {
    res.status(400).json({ message: "project must have a name" });
    return;
  }
  next();
}

server.listen(PORT, () =>
  console.log(` == server listening on port ${PORT} == `)
);
