/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import messages from './messages';
import api from './api';

/*
 * SETUP
 *
 * Methods that should only be called at first run
 * that help set up Messenger related config
 */

const SERVER_URL = process.env.SERVER_URL;

/**
 * Adds the server url to the Messenger App's whitelist.
 *
 * This is required to use Messenger Extensions which
 * this demo uses to get UserId's from a Messenger WebView.
 *
 * @returns {undefined}
 */
const setDomainWhitelisting = () => {
  api.callMessengerProfileAPI({
    whitelisted_domains: [SERVER_URL]
  })
};

/**
 * Sets the persistent menu for the application
 *
 * @returns {undefined}
 */
const setPersistentMenu = () => {
  api.callMessengerProfileAPI(messages.persistentMenu);
};

/**
 * Sets the Get Started button for the application
 *
 * @returns {undefined}
 */
const setGetStarted = () => {
  api.callMessengerProfileAPI(messages.getStarted);
};

export default {
  setDomainWhitelisting,
  setPersistentMenu,
  setGetStarted,
};
