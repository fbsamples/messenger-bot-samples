/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== MESSENGER =============================================================
import receiveApi from '../messenger-api-helpers/receive';

const router = express.Router();

/**
 * This is used so that Facebook can verify that they have
 * the correct Webhook location for your app.
 *
 * The Webhook token must be set in your app's configuration page
 * as well as in your servers environment.
 */
router.get('/', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.WEBHOOK_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong token');
  }
});

/**
 * Once your Webhook is verified this is where you will receive
 * all interactions from the users of you Messenger Application.
 *
 * You can subscribe to many different types of messages.
 * However for this demo we've only handled what is necessary:
 * 1. Regular messages
 * 2. Account Link
 */
router.post('/', (req, res) => {
  /*
    You must send back a status of 200(success) within 20 seconds
    to let us know you've successfully received the callback.
    Otherwise, the request will time out.

    When a request times out from Facebook the service attempts
    to resend the message.

    This is why it is good to send a response immediately so you
    don't get duplicate messages in the event that a request takes
    awhile to process.
  */
  res.sendStatus(200);

  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      if (!pageEntry.messaging) {
        return;
      }
      // Iterate over each messaging event
      pageEntry.messaging.forEach((messagingEvent) => {
        console.log({messagingEvent});
        if (messagingEvent.message) {
          receiveApi.handleReceiveMessage(messagingEvent);
        } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
          receiveApi.handleReceiveAccountLink(messagingEvent);
        } if (messagingEvent.postback) {
          receiveApi.handleReceivePostback(messagingEvent);
        } else {
          console.error(
            'Webhook received unknown messagingEvent: ',
            messagingEvent
          );
        }
      });
    });
  }
});

export default router;
