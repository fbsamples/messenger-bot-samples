/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getListsItems, getUsersLists, LISTS, USERS} =
  require('../sample-seed-helpers');

/**
 * Test ENV Seed File - When run with `knex seed:run`,
 * populates database with placeholder data.
 * @param {string} knex - Knex dependency
 * @param {Promise} Promise - Promise dependency
 * @returns {Promise} A single Promise that resolves when
 * user and list items have been inserted into the database.
 */
exports.seed = (knex, Promise) =>
  Promise.all([
    knex('users_lists').del(),
    knex('lists_items').del(),
    knex('lists').del(),
    knex('users').del(),
  ]).then(() =>
    Promise.all([
      knex('lists').insert(LISTS, 'id'),
      knex('users').insert(USERS, 'id'),
    ]).then((ids) => {
      const listIds = ids[0];

      return Promise.all([
        knex('users_lists').insert(getUsersLists(listIds)),
        knex('lists_items').insert(getListsItems(listIds)),
      ]);
    })
  );
