/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

// ===== MESSENGER =============================================================
import api from './api';

/* ----------  Globals  ---------- */
const {APP_URL} = process.env;

/* ----------  Functions  ---------- */

/**
 * Adds the server url to the Messenger App's whitelist.
 *
 * This is required to use Messenger Extensions which
 * this demo uses to get UserId's from a Messenger WebView.
 *
 * @returns {undefined}
 */
const domainWhitelisting = () => {
  api.callMessengerProfileAPI(
    {
      whitelisted_domains: [APP_URL],
    }
  );
};

/**
 * Sets the persistent menu for the application
 *
 * @returns {undefined}
 */
const persistentMenu = () => {
  api.callMessengerProfileAPI(
    {
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: true,
          call_to_actions: [
            {
              type: 'web_url',
              title: 'Create List',
              url: `${APP_URL}/lists/new`,
              webview_height_ratio: 'tall',
              messenger_extensions: true,
            },
            {
              type: 'postback',
              title: 'My Lists',
              payload: 'owned_lists',
            },
            {
              type: 'postback',
              title: 'Shared With Me',
              payload: 'subscribed_lists',
            },
          ],
        },
      ],
    }
  );
};

/**
 * Sets the Get Started button for the application
 *
 * @returns {undefined}
 */
const getStartedButton = () => {
  api.callMessengerProfileAPI(
    {
      get_started: {
        payload: 'get_started',
      },
    }
  );
};

export default {
  domainWhitelisting,
  persistentMenu,
  getStartedButton,
};
