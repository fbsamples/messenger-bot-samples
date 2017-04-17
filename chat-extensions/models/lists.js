/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
 /* eslint-disable camelcase */

// ===== DB ====================================================================
import Knex  from '../db/knex';

// ===== UTIL ==================================================================
import {camelCaseKeys} from './util';

const Lists = () => Knex('lists');
const ListsItems = () => Knex('lists_items');
const Users = () => Knex('users');
const UsersLists = () => Knex('users_lists');

/**
 * get - Gets the List with the given ID.
 * @param   {Number} listId - The ID of the List to return.
 * @returns {Object} list - The matched List.
 */
const get = (listId) =>
  Lists()
    .where('id', parseInt(listId, 10))
    .first()
    .then(camelCaseKeys);

/**
 * getAll - Gets all Lists
 * @returns {Array} lists - Array of all Lists.
 */
const getAll = () =>
  Lists().select()
    .then((lists) => lists.map(camelCaseKeys));

/**
 * getAllItems - Gets all ListsItems for the List with the given ID.
 * @param   {Number} listId - The ID of the List to get items for.
 * @returns {Array} listsItems - Array of all ListsItems
 */
const getAllItems = (listId) =>
  ListsItems()
    .where('list_id', parseInt(listId, 10))
    .select()
    .then((listsItems) => listsItems.map(camelCaseKeys));

/**
 * getAllUsers - Gets all Users of the List with the given ID.
 * @param   {Number} listId - The ID of the List to get Users for.
 * @returns {Array} users - Array of all Users for the matched List.
 */
const getAllUsers = (listId) =>
  Users()
    .join('users_lists', 'fb_id', 'users_lists.user_fb_id')
    .where('list_id', parseInt(listId, 10))
    .select('fb_id')
    .then((users) => users.map(camelCaseKeys));

/**
 * getOwner - Gets the User who owns the List with the given ID.
 * @param   {Number} listId - The ID of the List to get the Owner of.
 * @returns {Object} user - The User who owns the list.
 */
const getOwner = (listId) =>
  Users()
    .join('users_lists', 'fb_id', 'users_lists.user_fb_id')
    .where({list_id: parseInt(listId, 10), owner: true})
    .first('fb_id')
    .then(camelCaseKeys);

/**
 * getWithUsers - Returns the List with the given ID, with an array subscribed
 *                user FB IDs provided under `subscriberIds` key.
 * @param   {Number} listId - The ID of the List to return.
 * @returns {Object} list - The matched list, with `subscriberIds` key.
 */
const getWithUsers = (listId) =>
  Promise.all([get(listId), getAllUsers(listId)])
    .then(([list, users]) => {
      if (list) {
        list.subscriberIds = users.map((user = {}) => user.fbId);
      }

      return list;
    });

/**
 * getForUser - Returns all Lists associated with the given FB ID
 *              and ownership value.
 * @param   {Number} userFbId - The FB ID of the User to find Lists for.
 * @param   {Boolean} owner - The Ownership state to match Lists against.
 * @returns {Array} lists - The matched lists.
 */
const getForUser = (userFbId, owner) => {
  const query = Lists()
    .join('users_lists', 'lists.id', 'users_lists.list_id')
    .where('user_fb_id', userFbId);

  if (typeof owner !== 'undefined') {
    query.andWhere({owner});
  }

  return query.pluck('lists.id')
    .then((listIds = []) => Promise.all(listIds.map(getWithUsers)));
};

/**
 * getOwnedForUser — Returns all Lists that a User owns.
 * @param   {Number} userFbId - The FB ID of the User to find Lists for.
 * @returns {Array} lists - Array of all lists owned by the User.
 */
const getOwnedForUser = (userFbId) => getForUser(userFbId, true);

/**
 * getSharedToUser — Returns all Lists that have been shared with a User.
 * @param   {Number} userFbId - The FB ID of the User to find Lists for.
 * @returns {Array} lists - Array of all Lists shared with the User.
 */
const getSharedToUser = (userFbId) => getForUser(userFbId, false);

/**
 * addUser - Associates a User with a List, making
 *           them the owner if no other owner is found.
 * @param   {Number} listId - The ID of the List to subscribe a User to.
 * @param   {Number} userFbId - The FB ID of the User to add to a List.
 * @returns {Object} usersList
 */
const addUser = (listId, userFbId) => {
  return getOwner(listId)
    .then((user) => !!user)
    .then((hasOwner) =>
      UsersLists()
        .where({list_id: listId, user_fb_id: userFbId})
        .first()
        .then((usersList) => ({hasOwner, alreadyAdded: !!usersList}))
    )
    .then(({hasOwner, alreadyAdded}) => {
      if (alreadyAdded && !hasOwner) {
        return UsersLists()
          .where({list_id: listId, user_fb_id: userFbId})
          .first()
          .update({owner: true}, ['id', 'list_id', 'user_fb_id', 'owner'])
          .then(([usersList]) => camelCaseKeys(usersList));
      } else if (alreadyAdded) {
        return UsersLists()
          .where({list_id: listId, user_fb_id: userFbId})
          .first()
          .then(camelCaseKeys);
      }

      return UsersLists()
        .insert(
          {owner: !hasOwner, list_id: listId, user_fb_id: userFbId},
          ['id', 'list_id', 'user_fb_id', 'owner']
        )
        .then(([usersList]) => camelCaseKeys(usersList));
    });
};

/**
 * setOwner - Make the User with the provided FB ID
 *            the owner of the List with the given ID.
 * @param   {Number} listId - The ID of the List to make the User the owner of.
 * @param   {Number} userFbId - The FB ID of the User to be made owner.
 * @returns {Object} usersList
 */
const setOwner = (listId, userFbId) =>
  getOwner(listId)
    .then((user) => {
      if (!!user) {
        return UsersLists()
          .where({list_id: listId, user_fb_id: user.fbId})
          .update({owner: false}, 'id')
          .then(() => addUser(listId, userFbId));
      }

      return addUser(listId, userFbId);
    });

/**
 * setTitle - Sets the title of a given list.
 * @param   {String} newTitle - The new Title of the List
 * @param   {Number} listId - The ID of the list to be given the new title.
 * @returns {Object} list - The updated List.
 */
const setTitle = (newTitle = '', listId) => {
  const title = (newTitle === null) ? 'Shopping List' : newTitle;

  return Lists()
    .where('id', parseInt(listId, 10)).update({title}, ['id', 'title'])
    .then(([list]) => list);
};

/**
 * create - Creates a new list with the given title.
 * @param   {String} title - The title of the list to create.
 * @returns {Object} list - The newly created list.
 */
const create = (title = 'Shopping List') =>
  Lists()
    .insert({title}, 'id').then(get);

export default {
  addUser,
  create,
  get,
  getAll,
  getAllItems,
  getAllUsers,
  getForUser,
  getOwnedForUser,
  getSharedToUser,
  getOwner,
  getWithUsers,
  setOwner,
  setTitle,
};
