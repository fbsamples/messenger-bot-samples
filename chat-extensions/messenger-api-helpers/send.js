/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== LODASH ================================================================
import castArray from 'lodash/castArray';

// ===== MESSENGER =============================================================
import messages from './messages';
import api from './api';

const {APP_URL} = process.env;

// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
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

// Send the initial message welcoming & describing the bot.
const sendWelcomeMessage = (recipientId) => {
  sendMessage(recipientId, messages.welcomeMessage(APP_URL));
};

// Let the user know that they don't have any lists yet.
const sendNoListsYet = (recipientId) => {
  sendMessage(recipientId, messages.noListsMessage(APP_URL));
};

// Show user the lists they are associated with.
const sendLists = (recipientId, action, lists, offset) => {
  // Show different responses based on number of lists.
  switch (lists.length) {
  case 0:
    // Tell User they have no lists.
    sendNoListsYet(recipientId);
    break;
  case 1:
    // Show a single list — List view templates require
    // a minimum of 2 Elements. Rease More at:
    // https://developers.facebook.com/docs/
    // messenger-platform/send-api-reference/list-template
    const {id, title} = lists[0];

    sendMessage(
      recipientId,
      messages.shareListMessage(APP_URL, id, title, 'Open List'),
    );

    break;
  default:
    // Show a paginated set of lists — List view templates require
    // a maximum of 4 Elements. Rease More at:
    // https://developers.facebook.com/docs/
    // messenger-platform/send-api-reference/list-template
    sendMessage(
      recipientId,
      messages.paginatedListsMessage(APP_URL, action, lists, offset)
    );

    break;
  }
};

// Send a message notifying the user their list has been created.
const sendListCreated = (recipientId, listId, title) => {
  sendMessage(
    recipientId,
    [
      messages.listCreatedMessage,
      messages.shareListMessage(APP_URL, listId, title, 'Open List'),
    ]);
};

// Send a message notifying the user their list can be shared.
const sendListShareItem = (recipientId, listId, title) => {
  sendMessage(
    recipientId,
    [
      messages.listShareMessage,
      messages.shareListMessage(APP_URL, listId, title, 'Open List'),
    ]);
};

export default {
  sendListCreated,
  sendLists,
  sendListShareItem,
  sendMessage,
  sendNoListsYet,
  sendReadReceipt,
  sendWelcomeMessage,
};
