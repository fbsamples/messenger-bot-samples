/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Constants for placeholder List data for seed files.
const LISTS = [
  {title: 'Shopping List'},
  {title: 'To Do List'},
  {title: 'Party Planning List'},
];

// Constants for placeholder User data for seed files.
const USERS = [
  {fb_id: 1},
  {fb_id: 2},
  {fb_id: 3},
  {fb_id: 4},
];

/**
 * getUsersLists - Gets placeholder UsersLists data for seed files.
 * @param   {Array} listIds - Array of list IDs.
 * @returns {Array} usersLists - Array of placeholder usersLists data for seeds.
 */
const getUsersLists = (listIds = []) => [
  {list_id: listIds[0], user_fb_id: 1, owner: true},
  {list_id: listIds[0], user_fb_id: 2},
  {list_id: listIds[0], user_fb_id: 3},
  {list_id: listIds[1], user_fb_id: 1},
  {list_id: listIds[1], user_fb_id: 2, owner: true},
  {list_id: listIds[2], user_fb_id: 2, owner: true},
  {list_id: listIds[2], user_fb_id: 3},
];

/**
 * getListsItems - Gets placeholder ListsItems data for seed files.
 * @param   {Array} listIds - Array of list IDs.
 * @returns {Array} listsItems - Array of placeholder listsItems data for seeds.
 */
const getListsItems = (listIds = []) => [
  {name: 'Cheese', list_id: listIds[0], owner_fb_id: 1, completer_fb_id: 2},
  {name: 'Milk', list_id: listIds[0], owner_fb_id: 3, completer_fb_id: 3},
  {name: 'Bread', list_id: listIds[0], owner_fb_id: 1},
  {name: 'Pay Bills', list_id: listIds[1], owner_fb_id: 1, completer_fb_id: 2},
  {name: 'Call Parents', list_id: listIds[1], owner_fb_id: 2},
  {name: 'Balloons', list_id: listIds[2], owner_fb_id: 2},
  {name: 'Invites', list_id: listIds[2], owner_fb_id: 3},
];

module.exports = {getListsItems, getUsersLists, LISTS, USERS};
