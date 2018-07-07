/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

const router = express.Router();

// GET home page
router.get('/', (_, res) => {
  res.render('./index', {
    demo: process.env.DEMO,
    listId: null,
  });
});

export default router;
