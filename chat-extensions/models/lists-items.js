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

const ListsItems = () => Knex('lists_items');

/**
 * get - Gets the ListItem with the given ID.
 * @param   {Number} listsItemId - the ID of the ListItem to return.
 * @returns {Objst} listsItem - The matching ListsItem object.
 */
export const get = (listsItemId) =>
  ListsItems()
    .where('id', parseInt(listsItemId, 10))
    .first()
    .then(camelCaseKeys);

/**
 * create - Creates a new ListsItem.
 * @param   {String} name - The name of the ListsItem to create.
 * @param   {Number} listId - The ID of the List to create the ListsItem for.
 * @param   {Number} ownerFbId - The FB ID of the User who owns the list.
 * @returns {Object} listsItem - The newly created ListsItem.
 */
export const create = (name = '', listId, ownerFbId) =>
  ListsItems().insert({
    list_id: listId,
    name: name,
    owner_fb_id: ownerFbId,
  }, 'id')
    .then((listsItemId) => get(listsItemId));

/**
 * update - Update a ListsItem with the given values.
 * @param   {Number} options.id - The ID of the ListsItem to update.
 * @param   {String} options.name - The updated name of the ListsItem.
 * @param   {Number} options.completerFbId - FB ID of the Completer
 * @returns {Object} listsItem - the updated ListsItem.
 */
export const update = ({id, name, completerFbId}) =>
  ListsItems().where('id', parseInt(id, 10)).update({
    completer_fb_id: completerFbId,
    name,
  }, 'id').then((listsItemId) => get(listsItemId));

export default {create, get, update};
