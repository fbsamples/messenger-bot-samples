/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== DB ====================================================================
import Lists from '../models/lists';
import ListsItems from '../models/lists-items';

// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';

// Update the title of the given List and
// notifies all subscribed users of the change.
const updateTitle = ({request: {listId, title}, sendStatus, socket}) => {
  Lists.setTitle(title, listId)
    .then((list) => {
      socket.to(list.id).emit('title:update', list.title);
      sendStatus('ok');
    });
};

// Creates a new ListItem and notifies
// all subscribed users of the change.
const addItem = ({
  request: {senderId, listId, name},
  sendStatus,
  allInRoom,
}) => {
  ListsItems.create(name, listId, senderId)
    .then((listItem) => {
      allInRoom(listId).emit('item:add', listItem);
      sendStatus('ok');
    });
};

// Updates an existing ListItem and notifies
// all subscribed users of the change.
const updateItem = ({request, sendStatus, allInRoom}) => {
  const {listId, id, name, completerFbId} = request;
  console.log('request', {listId, id, name, completerFbId});

  ListsItems.update({id, name, completerFbId})
    .then(({id, name, completerFbId}) => {
      allInRoom(listId)
        .emit('item:update', {id, name, completerFbId});
      sendStatus('ok');
    });
};

// Shares a list into the thread from where it can be forwarded to other users
const shareList = ({
  request: {senderId, listId, title},
  sendStatus
}) => {
  if (!listId) {
    console.error('shareList: Invalid list ID');
    return;
  }
  sendApi.sendListShareItem(senderId, listId, title);
  sendStatus('ok');
};

export default {
  addItem,
  updateItem,
  updateTitle,
  shareList,
};
