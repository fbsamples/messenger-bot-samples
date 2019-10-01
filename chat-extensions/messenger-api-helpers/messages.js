/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */

/*
 * BUTTONS
 *
 * Objects and methods that create objects that represent
 * buttons to be used in various UI elements.
 */

/**
 * Button for opening a specific list in a webview
 *
 * @param {string} listUrl - URL for a specific list.
 * @param {string} buttonText - Text for the action button.
 * @returns {object} -
 *   Message to create a button pointing to the list in a webview.
 */
const openExistingListButton = (listUrl, buttonText = 'Edit List') => {
  return {
    type: 'web_url',
    title: buttonText,
    url: listUrl,
    messenger_extensions: true,
    webview_height_ratio: 'tall',
  };
};

/**
 * Button for opening a new list in a webview
 *
 * @param {string} apiUri - Hostname of the server.
 * @param {string=} buttonTitle - Button title.
 * @returns {object} -
 *   Message to create a button pointing to the new list form.
 */
const createListButton = (apiUri, buttonTitle = 'Create a List') => {
  return {
    type: 'web_url',
    url: `${apiUri}/lists/new`,
    title: buttonTitle,
    webview_height_ratio: 'tall',
    messenger_extensions: true,
  };
};

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to Messenger users.
 */

/**
 * Message that welcomes the user to the bot
 *
 * @param {string} apiUri - Hostname of the server.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const welcomeMessage = (apiUri) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Ready to make a shared list with your friends? Everyone can add items, check things off, and stay in sync.',
        buttons: [
          createListButton(apiUri),
        ],
      },
    },
  };
};

/**
 * Message for when the user has no lists yet.
 *
 * @param {string} apiUri - Hostname of the server.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const noListsMessage = (apiUri) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'It looks like you don’t have any lists yet. Would you like to create one?',
        buttons: [
          createListButton(apiUri),
        ],
      },
    },
  };
};

/**
 * Helper to construct a URI for the desired list
 *
 * @param {string} apiUri -
 *   Base URI for the server.
 *   Because this moduele may be called from the front end, we need to pass it explicitely.
 * @param {int} listId - The list ID.
 * @returns {string} - URI for the required list.
 */
const listUrl = (apiUri, listId) => `${apiUri}/lists/${listId}`;

/**
 * A single list for the list template.
 * The name here is to distinguish lists and list templates.
 *
 * @param {string} id            - List ID.
 * @param {string} apiUri        - Url of endpoint.
 * @param {string} subscriberIds - Ids of each subscriber.
 * @param {string} title         - List title.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const listElement = ({id, subscriberIds, title}, apiUri) => {
  return {
    title: title,
    subtitle: `Shared with ${[...subscriberIds].length} people`,
    default_action: {
      type: 'web_url',
      url: listUrl(apiUri, id),
      messenger_extensions: true,
      webview_height_ratio: 'tall',
    },
  };
};

/**
 * Messages for a list template of lists (meta!), offset by how many
 * "read mores" the user has been through
 *
 * @param {string} apiUri - Hostname of the server.
 * @param {string} action - The postback action
 * @param {Array.<Object>} lists - All of the lists to be (eventually) displayed.
 * @param {int=} offset - How far through the list we are so far.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const paginatedListsMessage = (apiUri, action, lists, offset = 0) => {
  const pageLists = lists.slice(offset, offset + 4);

  let buttons;
  if (lists.length > (offset + 4)) {
    buttons = [
      {
        title: 'View More',
        type: 'postback',
        payload: `${action}_OFFSET_${offset + 4}`,
      },
    ];
  }

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: pageLists.map((list) => listElement(list, apiUri)),
        buttons,
      },
    },
  };
};

/**
 * Message that informs the user that their list has been created.
 */
const listCreatedMessage = {
  text: 'Your list was created.',
};

/**
 * Message that informs the user that their list can be shared.
 */
const listShareMessage = {
  text: 'To share the list, simply forward the item below to your friends.',
};

/**
 * Message template for sharing a list with another user
 *
 * @param {string} apiUri - Application basename
 * @param {string} listId - The ID for list to be shared
 * @param {string} title - Title of the list
 * @param {string} buttonText - Text for the action button.
 * @returns {object} - Message to configure the customized sharing menu.
 */
const shareListMessage = (apiUri, listId, title, buttonText) => {
  const urlToList = listUrl(apiUri, listId);
  console.log({urlToList});
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: title,
          image_url: `${apiUri}/media/button-cover.png`,
          subtitle: 'A shared list from Tasks',
          default_action: {
            type: 'web_url',
            url: urlToList,
            messenger_extensions: true,
          },
          buttons: [openExistingListButton(urlToList, buttonText)],
        }],
      },
    },
  };
};

export default {
  welcomeMessage,
  listCreatedMessage,
  listShareMessage,
  paginatedListsMessage,
  createListButton,
  noListsMessage,
  shareListMessage,
};
