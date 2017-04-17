/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import sendApi from './send';

// ===== STORES ================================================================
import UserStore from '../stores/user_store';

/*
 * Account Link Event - This event is called when the Link Account
 * or Unlink Account action has been tapped. Read More at:
 * https://developers.facebook.com/docs/messenger-platform/
 * webhook-reference/account-linking
 */
const handleReceiveAccountLink = (event) => {
  const senderId = event.sender.id;

  /* eslint-disable camelcase */
  const status = event.account_linking.status;
  const authCode = event.account_linking.authorization_code;
  /* eslint-enable camelcase */

  console.log('Received account link event with for user %d with status %s ' +
    'and auth code %s ', senderId, status, authCode);

  switch (status) {
  case 'linked':
    const linkedUser = UserStore.replaceAuthToken(authCode, senderId);
    sendApi.sendSignInSuccessMessage(senderId, linkedUser.username);
    break;
  case 'unlinked':
    UserStore.unlinkMessengerAccount(senderId);
    sendApi.sendSignOutSuccessMessage(senderId);
    break;
  default:
    break;
  }
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
  const {type} = JSON.parse(event.postback.payload);
  const senderId = event.sender.id;

  // Perform an action based on the type of payload received.
  switch (type) {
  case 'GET_STARTED':
    sendApi.sendWelcomeMessage(senderId);
    break;
  default:
    console.error(`Unknown Postback called: ${type}`);
    break;
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
  handleReceiveAccountLink,
  handleReceiveMessage,
  handleReceivePostback,
};
