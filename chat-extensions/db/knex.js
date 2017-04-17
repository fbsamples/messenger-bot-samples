/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import knex from 'knex';

// ===== KNEXFILE ==============================================================
import knexFile from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = knexFile[environment];

export default knex(knexConfig);
