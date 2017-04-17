/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== DB ====================================================================
import Knex  from '../db/knex';

// ===== UTIL ==================================================================
import {camelCaseKeys} from './util';

const Users = () => Knex('users');

/**
 * findOrCreate - Finds or Creates a new User, and returns that user.
 * @param   {Object} user - The user to find or create.
 * @returns {Object} user - The created user.
 */
export const findOrCreate = (user = {}) => {
  return Users()
    .where('fb_id', parseInt(user.fb_id, 10))
    .first()
    .then((foundUsers) => {
      if (!foundUsers) {
        return Users().insert(user, 'fb_id');
      }
      return Users()
        .where('fb_id', parseInt(user.fb_id, 10))
        .update(user, 'fb_id');
    })
    .then((userFbId) => {
      return Users()
        .where('fb_id', parseInt(userFbId, 10))
        .first()
        .then(camelCaseKeys);
    });
};

/**
 * get - Gets a User object from the database.
 * @param   {userFbId} userFbId - the FB ID to find a User by.
 * @returns {Object} user - The found user.
 */
export const get = (userFbId) =>
  Users()
    .where('fb_id', parseInt(userFbId, 10))
    .first()
    .then(camelCaseKeys);

export default {findOrCreate, get};
