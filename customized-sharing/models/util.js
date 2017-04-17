/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== LODASH ================================================================
import camelCase from 'lodash/fp/camelCase';
import mapKeys from 'lodash/fp/mapKeys';
import snakeCase from 'lodash/fp/snakeCase';

/**
 * getKeyFormatter - Returns a fn for mapping an Object's keys to values
 *                   created by the provided formatter fn.
 * @param  {Function} formatter — Formats key values, should return a string.
 * @returns {Function} - Maps an Object's keys to new values.
 */
const getKeyFormatter = (formatter) => {
  return (object) =>
    (typeof object === 'object')
      ? mapKeys(formatter, object)
      : object;
};

export const camelCaseKeys = getKeyFormatter(camelCase);
export const snakeCaseKeys = getKeyFormatter(snakeCase);
