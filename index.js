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

server.listen(PORT, () =>
  console.log(` == server listening on port ${PORT} == `)
);
