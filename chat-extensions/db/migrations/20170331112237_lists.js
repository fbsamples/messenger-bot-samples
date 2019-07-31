/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable('lists', (table) => {
      table.increments();
      table.string('title').defaultTo('Shopping List').notNullable();
    }),

    knex.schema.createTable('lists_items', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.integer('list_id').references('lists.id').notNullable();
      table.bigInteger('owner_fb_id').references('users.fb_id').notNullable();
      table.bigInteger('completer_fb_id').references('users.fb_id');
    }),

    knex.schema.createTable('users', (table) => {
      table.increments();
      table.bigInteger('fb_id').unique().notNullable();
    }),

    knex.schema.createTable('users_lists', (table) => {
      table.increments();
      table.integer('list_id').references('lists.id').notNullable();
      table.bigInteger('user_fb_id').references('users.fb_id').notNullable();
      table.boolean('owner').defaultTo(false).notNullable();
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('users_lists'),
    knex.schema.dropTable('lists_items'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('lists'),
  ]);
};
