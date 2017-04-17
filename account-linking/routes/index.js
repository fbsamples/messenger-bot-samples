/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import {Router} from 'express';

const router = Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

export default router;
