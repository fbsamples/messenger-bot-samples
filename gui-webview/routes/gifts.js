/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== STORES ================================================================
import GiftStore from '../stores/gift-store';

const router = express.Router();

// Get Gift page
router.get('/:giftId', ({params: {giftId}}, res) => {
  const gift = GiftStore.get(giftId);

  const giftJSON = JSON.stringify(gift);
  console.log(`GET Gift response: ${giftJSON}`);

  res.render(
    './index',
    {
      demo: process.env.DEMO,
      gift: giftJSON,
      title: gift.name,
    }
  );
});

export default router;
