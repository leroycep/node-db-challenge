exports.up = function (knex) {
  return knex.schema
    .createTable("contexts", (tbl) => {
      tbl.increments();
      tbl.string("name").notNullable().unique();
    })
    .createTable("task_contexts", (tbl) => {
      tbl
        .integer("task_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("tasks");
      tbl
        .integer("context_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("contexts");
      tbl.primary(["task_id", "context_id"]);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("task_contexts")
    .dropTableIfExists("contexts");
};
