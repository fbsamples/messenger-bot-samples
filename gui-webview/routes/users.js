/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';
import receiveApi from '../messenger-api-helpers/receive';

// ===== STORES ================================================================
import UserStore from '../stores/user-store';

const router = express.Router();

// Get user preferences
router.get('/:userID', ({params: {userID}}, res) => {
  const user = UserStore.get(userID) || UserStore.insert({id: userID});
  const userJSON = JSON.stringify(user);

  console.log(`GET User response: ${userJSON}`);

  res.setHeader('Content-Type', 'application/json');
  res.send(userJSON);
});

/**
 * Return gifts based on preferences,
 * and store a user's preferences if `persist` if selected (idempotent)
 */
router.put('/:userID', ({body, params: {userID}}, res) => {
  if (body.persist) {
    UserStore.insert({...body, id: userID});
  }

  const userJSON = JSON.stringify({...body, userID});
  console.log(`PUT User response: ${userJSON}`);

  res.sendStatus(204);

  sendApi.sendPreferencesChangedMessage(userID);
});

/**
 * Update a users selected gift,
 */
router.put('/:userID/gift/:giftID', ({params: {userID, giftID}}, res) => {
  console.log('PUT User Gift response:', {userID, giftID});

  res.sendStatus(204);
  receiveApi.handleNewGiftSelected(userID, giftID);
});

/**
 * Send purchase confirmation into thread.
 */
router.put('/:userID/purchase/:giftID', ({params: {userID, giftID}}, res) => {
  console.log('PUT User Purchase response:', {userID, giftID});

  res.sendStatus(204);
  receiveApi.handleNewGiftPurchased(userID, giftID);
});


export default router;
