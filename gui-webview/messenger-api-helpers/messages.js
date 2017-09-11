/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to Messenger users.
 */

// ===== STORES ================================================================
import UserStore from '../stores/user-store';
import GiftStore from '../stores/gift-store';


// ===== UTILS =================================================================
import {dateString} from '../utils/date-string-format';

const SERVER_URL = process.env.SERVER_URL;

/**
 * Button for displaying the preferences menu inside a webview
 */
const setPreferencesButton = {
  type: 'web_url',
  title: 'Set Gift Preferences',
  url: `${SERVER_URL}/`,
  webview_height_ratio: 'tall',
  messenger_extensions: true,
};

/*
 * Button for displaying the view details button for a gift
 */
const viewDetailsButton = (giftId) => {
  return {
    title: 'View Details',
    type: 'web_url',
    url: `${SERVER_URL}/gifts/${giftId}`,
    webview_height_ratio: 'compact',
    messenger_extensions: true,
  };
};

/*
 * Button for selecting a gift
 */
const chooseGiftButton = (giftId) => {
  return {
    type: 'postback',
    title: 'Choose This Gift',
    payload: JSON.stringify({
      type: 'CHOOSE_GIFT',
      data: {
        giftId: giftId,
      },
    }),
  };
};

/**
 * Button for displaying a postback button that triggers the change gift flow
 */
const changeGiftButton = {
  type: 'postback',
  title: 'Change Gift',
  payload: JSON.stringify({
    type: 'CHANGE_GIFT',
  }),
};

/**
 * Message that informs the user of the promotion and prompts
 * them to set their preferences.
 */
const helloRewardMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Thanks for joining our reward program! We’d love to send you a free birthday gift.',
      buttons: [setPreferencesButton],
    },
  },
};

/**
 * Message that informs the user that their preferences have changed.
 */
const preferencesUpdatedMessage = {
  text: 'OK, we’ve updated your preferences. You can change them anytime you want from the menu.',
};

/**
 * Message that informs that we have their current gift selected.
 */
const currentGiftText = {
  text: 'This is your current gift selection. If you’d like to change it, you can do so below.',
};

/**
 * Message that informs the user what gift has been selected for them
 * and prompts them to select a different gift.
 *
 * @param {String} recipientId Id of the user to send the message to.
 * @returns {Object} Message payload
 */
const currentGiftButton = (recipientId) => {
  const user = UserStore.get(recipientId);
  const gift = user.preferredGift;

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: `Your Gift: ${gift.name}`,
            image_url: gift.images.original,
            subtitle: gift.description,
            buttons: [
              viewDetailsButton(gift.id),
              changeGiftButton,
            ],
          },
        ],
      },
    },
  };
};

/**
 * Message that precedes us displaying recommended gifts.
 */
const giftOptionsText = {
  text: 'Here are some gift options for you:',
};

/**
 * Message that informs the user what gift has been selected for them
 * and prompts them to select a different gift.
 *
 * @param {Object} id - The Gifts unique id.
 * @param {Object} name - The Gifts name.
 * @param {Object} description - The Gifts description.
 * @param {Object} original - Path to the original image for the gift.
 * @returns {Object} Messenger representation of a carousel item.
 */
const giftToCarouselItem = ({id, name, description, images: {original}}) => {
  return {
    title: name,
    image_url: original,
    subtitle: description,
    buttons: [
      viewDetailsButton(id),
      chooseGiftButton(id),
    ],
  };
};

/**
 * Message that informs the user what gift has been selected for them
 * and prompts them to select a different gift.
 *
 * @param {String} recipientId Id of the user to send the message to.
 * @returns {Object} Message payload
 */
const giftOptionsCarosel = (recipientId) => {
  const user = UserStore.get(recipientId) || UserStore.insert({id: recipientId});
  const giftOptions = user.getRecommendedGifts();

  const carouselItems = giftOptions.map(giftToCarouselItem);

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: carouselItems,
      },
    },
  };
};

/**
 * Message that informs the user what gift will be sent to them.
 *
 * @param {String} recipientId Id of the user to send the message to.
 * @returns {Object} Message payload
 */
const giftChangedMessage = (recipientId) => {
  const {preferredGift, dateOfBirth} = UserStore.get(recipientId);
  return {
    text: `Perfect! You can look forward to the ${preferredGift.name} on ${dateString(dateOfBirth)}. `,
  };
};

/**
 * Message thanking user for their purchase.
 *
 * @param {String} giftId Id of the purchased item.
 * @returns {Object} Message payload
 */
const giftPurchasedMessage = (giftId) => {
  const purchasedItem = GiftStore.get(giftId);
  return {
    text: `Thank you for purchasing the ${purchasedItem.name}!  `,
  };
};

/**
 * The persistent menu for users to use.
 */
const persistentMenu = {
  setting_type: 'call_to_actions',
  thread_state: 'existing_thread',
  call_to_actions: [
    setPreferencesButton,
    changeGiftButton,
  ],
};

/**
 * The Get Started button.
 */
const getStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread',
  call_to_actions: [
    {
      payload: JSON.stringify({
        type: 'GET_STARTED',
      }),
    },
  ],
};

export default {
  helloRewardMessage,
  preferencesUpdatedMessage,
  currentGiftText,
  currentGiftButton,
  giftOptionsText,
  giftOptionsCarosel,
  giftChangedMessage,
  giftPurchasedMessage,
  persistentMenu,
  getStarted,
};
