/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

const router = express.Router();

// GET terms & conditions page for the application
router.get('/', (_, res) => {
  res.render('./index', {demo: false, terms: true, title: 'Terms & Conditions'});
});

export default router;
