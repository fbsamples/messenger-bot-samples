/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */

/*
 * PURCHASE
 *
 * Objects and methods for presenting the user with native fb payment options.
 * https://developers.facebook.com/docs/messenger-platform/webview/payments
 *
 */

// ===== STORES ================================================================
import GiftStore from '../stores/gift-store';

// ===== HELPERS ================================================================
import WebviewControls from '../messenger-api-helpers/webview-controls';
import logger from './fba-logging';


const SERVER_URL = location.protocol + '//' + location.hostname;

/**
 * The payment options configuration.
 */
const methodData =
[{
  supportedMethods: ['fb'],
  data: {
    termsUrl: SERVER_URL + '/terms', // Merchant payment terms and conditions.
    merchantFBPageId: process.env.PAGE_ID, // page id with onboarded payment method.
  }
}];

/**
 * The additional payment options configuration.
 */
const additionalOptions = {
  requestShipping: true, // if shipping is required
  requestPayerName: true, // name of the payer sent with the final response
  requestPayerEmail: true, // email address, same as above
  requestPayerPhone: true, // phone number, same as above
};

/**
 * Shipping options configurations.
 */
const standardShipping = {
  id: 'standard',
  label: 'Standard shipping',
  amount: {currency: 'USD', value: '1.10'},
};
const expressShipping = {
  id: 'express',
  label: 'Express shipping',
  amount: {currency: 'USD', value: '1.20'},
  selected: true,
}

/**
* Calculate tax of the item.
*
* @param {String} price Cost of the item being purchased.
* @returns {String} Tax of the item.
*/
const calculateTax = (price) => {
  return (price * .07).toFixed(2);
};

/**
* Calculate total price including shipping and tax of the item.
*
* @param {String} price Cost of the item being purchased.
* @param {String} shipping Shipping cost of the item being purchased.
* @returns {String} Total price including shipping and tax of purchased item.
*/
const calculateTotal = (price, shipping) => {
  return (price * 1.07 + parseFloat(shipping)).toFixed(2);
};

/**
* Build payment details based on gift price.
*
* @param {String} giftId Id of the item being purchased.
* @param {Object} shipping Selected shipping option.
* @returns {Object} paymentDetails passed into the SDK payment request.
*/
const paymentDetails = (giftId, shipping) => {
  const gift = GiftStore.get(giftId);
  return {
    displayItems: [
      {
        label: gift.name,
        amount: {
          currency: 'USD',
          value : gift.price.toString()
        },
      },
      {
        label: 'Sales Tax',
        amount: {
          currency: 'USD',
          value : calculateTax(gift.price)
        },
      },
     shipping
    ],
    total: {
      label: 'Total due', // defaults to "Total"
      amount: {
        currency: 'USD',
        value : calculateTotal(gift.price, 0.0)// shipping.amount.value)
      },
    },
    shippingOptions: [standardShipping, expressShipping]
  };
};

/**
 * Sends message to server which in turn sends thank you text bubble into
 * thread.
 *
 * @param {String} giftId Id of the item being purchased.
 * @param {String} userId Recipient of purchase notification.
 * @returns {undefined}
 */
const thankForPurchase = (giftId, userId) => {
  fetch(`/users/${userId}/purchase/${giftId}`, {
    method: 'PUT',
  }).then((response) => {
    if (response.ok) {
      console.log('Purchase confirmation sent to user!');
      return;
    }

    console.error(
      response.status,
      `Unable to to send confirmation into thread for ${userId}'`
    );
  }).catch((err) => console.error('Error pushing data', err)).then(() => {
    WebviewControls.close();
  });
};

/**
 * Opens the payment sheet prompting the user to enter payment details.
 *
 * @param {String} giftId Id of the item being purchased.
 * @param {String} userId Recipient of purchase notification.
 * @returns {undefined}
 */
const buyItem = (giftId, userId) => {

  var currentShippingOption = 'express';
  var details = paymentDetails(giftId, expressShipping);
  let request = new window.MessengerExtensions.PaymentRequest(
    methodData, details, additionalOptions);

  // the user has aborted the flow
  request.addEventListener('checkoutcancel', () => {
    logger.fbLog('payment_step', {step: "cancel"}, userId);
  });

  // Register shipping address change callback
  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(new Promise(function(resolve, reject) {
      const address = evt.target.shippingAddress;
      // re-calculate shipping cost based on address change
      logger.fbLog('shipping', {event: "address_change"}, userId);

      if (currentShippingOption === 'standard') {
        details = paymentDetails(giftId, standardShipping);
      } else {
        details = paymentDetails(giftId, expressShipping);
      }
      resolve(details);
    }));
  });

  // Register shipping option change callback
  request.addEventListener('shippingoptionchange', function(evt) {
    evt.updateWith(new Promise(function(resolve, reject) {
      const option = evt.target.shippingOption;
      logger.fbLog('shipping', {event: "option_update", option: option}, userId);

      // update shipping type
      if (option === 'standard') {
        details = paymentDetails(giftId, standardShipping);
      } else {
        details = paymentDetails(giftId, expressShipping);
      }
      currentShippingOption = option;
      resolve(details);
    }));
  });

  request.canMakePayment().then((response) => {
    if (response === true) {
      logger.fbLog('payment_step', {step: "show_checkout"}, userId);
      request.show().then(function(paymentResponse) {
        paymentResponse.complete('success').then(function() {
          logger.fbLog('payment_step', {step: "complete", gift_id: giftId}, userId);
          // send a confirmation bubble into the thread.
          thankForPurchase(giftId, userId);
        });
      }).catch(function(error) {
        logger.fbLog('payment_step', {step: "error"}, userId);
      });
    } else {
      logger.fbLog('payment_step', {step: "cant_make_payment"}, userId);
    }
  })
  .catch((error) => {
    console.log('canMakePayment exception: ' + JSON.stringify(error, null, 4));
  });
};

export default {
  buyItem,
};
