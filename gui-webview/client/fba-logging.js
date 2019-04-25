/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */

/**
 * For logging custom events to FB Analytics dashboard from client -
 * facebook.com/analytics
 *
 * @param {string} eventName - Name of event in fb analytics.
 * @param {string} payload - Parameters stored with event in fb analytics.
 * @param {string} psid - PSID of user who triggered the event.
 * @returns {undefined}
 */
const fbLog = (eventName, payload, psid) => {
  if (payload !== null && typeof payload === 'object') {
    payload["_eventName"] = eventName;
    const body = JSON.stringify({
      event: 'CUSTOM_APP_EVENTS',
      custom_events: JSON.stringify([payload]),
      advertiser_tracking_enabled: 0,
      application_tracking_enabled: 0,
      extinfo: JSON.stringify(['mb1']),
      page_id: process.env.PAGE_ID,
      page_scoped_user_id: psid
    });

    fetch("https://graph.facebook.com/v3.2/" + process.env.APP_ID + "/activities", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch (function (error) {
        console.log('FB Analytics logging request failed', error);
    });
  }
}

export default {
  fbLog,
};
