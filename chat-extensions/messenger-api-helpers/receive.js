/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import sendApi from './send';

// ===== MODELS ================================================================
import Lists from '../models/lists';

/**
 * sendSharedLists - Gets & Sends a list of all lists a user owns.
 * @param   {Number} senderId - FB ID to send to.
 * @param   {String} type - Postback Action type to respond to.
 * @returns {Undefined} - .
 */
const sendOwnedLists = (senderId, type) => {
  Lists.getOwnedForUser(senderId)
    .then((lists) => {
      sendApi.sendLists(senderId, type, lists, Number(type.substring(19)));
    });
};

/**
 * sendSharedLists - Gets & Sends a list of all lists a user is associated with.
 * @param   {Number} senderId - FB ID to send to.
 * @param   {String} type - Action type to send.
 * @returns {Undefined} - .
 */
const sendSharedLists = (senderId, type) => {
  Lists.getSharedToUser(senderId)
    .then((lists) => {
      sendApi.sendLists(senderId, type, lists, Number(type.substring(22)));
    });
};

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = (event) => {
  /**
   * The 'payload' param is a developer-defined field which is
   * set in a postbackbutton for Structured Messages.
   *
   * In this case we've defined our payload in our postback
   * actions to be a string that represents a JSON object
   * containing `type` and `data` properties. EG:
   */
  const type = event.postback.payload;
  const senderId = event.sender.id;

  // Perform an action based on the type of payload received.
  if (type.substring(0, 11) === 'owned_lists') {
    sendOwnedLists(senderId, type);
  } else if (type.substring(0, 16) === 'subscribed_lists') {
    sendSharedLists(senderId, type);
  } else if (type.substring(0, 11) === 'get_started') {
    sendApi.sendWelcomeMessage(senderId);
    return;
  } else {
    console.error(`Unknown Postback called: ${type}`);
  }
};

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);

  if (message.text) { sendApi.sendWelcomeMessage(senderId); }
};

export default {
  handleReceivePostback,
  handleReceiveMessage,
};
