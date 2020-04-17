const knex = require("knex");

const knexfile = require("../knexfile.js");

// TODO: choose configuration based on environment variable
module.exports = knex(knexfile.development);
