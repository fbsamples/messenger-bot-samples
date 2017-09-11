/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== LODASH ================================================================
import castArray from 'lodash/castArray';

// ===== MESSENGER =============================================================
import api from './api';
import messages from './messages';
import logger from './fba-logging';

// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
  };
};

// Turns typing indicator off.
const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off', // eslint-disable-line camelcase
  };
};

// Wraps a message JSON object with recipient information.
const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

// Send one or more messages using the Send API.
const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI([
    typingOn(recipientId),
    ...messagePayloadArray,
    typingOff(recipientId),
  ]);
};

// Send a read receipt to indicate the message has been read
const sendReadReceipt = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen', // eslint-disable-line camelcase
  };

  api.callMessagesAPI(messageData);
};

// Send the initial message telling the user about the promotion.
const sendHelloRewardMessage = (recipientId) => {
  logger.fbLog("send_message", {payload: "hello_reward"}, recipientId);
  sendMessage(recipientId, messages.helloRewardMessage);
};

// Send a message indicating to a user that their preferences have changed.
const sendPreferencesChangedMessage = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.preferencesUpdatedMessage,
      messages.currentGiftText,
      messages.currentGiftButton(recipientId),
    ]);
};

// Send a message displaying the gifts a user can choose from.
const sendChooseGiftMessage = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.giftOptionsText,
      messages.giftOptionsCarosel(recipientId),
    ]);
};

// Send a message that a users preffered gift has changed.
const sendGiftChangedMessage = (recipientId) =>
  sendMessage(recipientId, messages.giftChangedMessage(recipientId));

// Send a message that a user has purchased a gift.
const sendGiftPurchasedMessage = (recipientId, giftId) =>
  sendMessage(recipientId, messages.giftPurchasedMessage(giftId));


export default {
  sendMessage,
  sendReadReceipt,
  sendHelloRewardMessage,
  sendPreferencesChangedMessage,
  sendChooseGiftMessage,
  sendGiftChangedMessage,
  sendGiftPurchasedMessage,
};
