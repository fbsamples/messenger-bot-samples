/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import request from 'request';

const APP_ID = process.env.APP_ID;
const PAGE_ID = process.env.PAGE_ID;

/**
 * For logging custom events to FB Analytics dashboard from server -
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
    request.post({
      url : "https://graph.facebook.com/" + APP_ID + "/activities",
      form: {
        event: 'CUSTOM_APP_EVENTS',
        custom_events: JSON.stringify([payload]),
        advertiser_tracking_enabled: 0,
        application_tracking_enabled: 0,
        extinfo: JSON.stringify(['mb1']),
        page_id: PAGE_ID,
        page_scoped_user_id: psid
      }
    }, function(err,httpResponse,body){
      console.error(err);
      console.log(httpResponse.statusCode);
      console.log(body);
    });
  } else {
    console.log("Invalid payload for fb logging.");
  }
};

export default {
  fbLog,
};
