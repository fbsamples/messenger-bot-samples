/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== DB ====================================================================
import Lists from '../models/lists';
import Users from '../models/users';

// ===== MESSENGER =============================================================
import userApi from '../messenger-api-helpers/user';
import sendApi from '../messenger-api-helpers/send';

// Find or Create a new/existing User with the given id.
const getUser = (senderId) => {
  return Users.findOrCreate({
    fb_id: senderId, // eslint-disable-line camelcase
  });
};

// Promise wrapper for Facebook UserApi.
const getUserDetails = (senderId) => {
  return new Promise((resolve, reject) => {
    userApi.getDetails(senderId, (err, {statusCode}, body) => {
      if (err) {
        return reject(err);
      } else if (statusCode !== 200) {
        return reject({
          statusCode,
          message: 'Unable to fetch user data for user',
          senderId,
        });
      }

      return resolve({
        name: body.first_name || body.last_name || senderId,
        profilePic: body.profile_pic,
        fbId: senderId,
      });
    });
  });
};

const getFacebookProfileInfoForUsers = (users = [], listId, socketUsers) =>
  Promise.all(users.map((user) => getUserDetails(user.fbId)))
    .then((res) => res.map((resUser = {}) => {
      // Detect online status via socketUser with matching list & FB IDs.
      const isOnline = [...socketUsers.values()].find((socketUser) =>
        socketUser.listId === listId && socketUser.userId === resUser.fbId);

      return Object.assign({}, resUser, {online: !!isOnline || false});
    }));

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const join = ({
  request: {senderId, listId},
  allInRoom,
  sendStatus,
  socket,
  socketUsers,
  userSocket,
}) => {
  Promise.all([
    Lists.get(listId),
    Lists.getAllItems(listId),
    Lists.getOwner(listId),
    getUser(senderId),
  ]).then(([list, items, listOwner, user]) => {
    if (!list) {
      console.error("List doesn't exist!");
      sendStatus('noList');
    }

    Lists.addUser(list.id, user.fbId)
      .then((usersList) => {
        if (!listOwner) {
          sendApi.sendListCreated(user.fbId, list.id, list.title);
          allInRoom(list.id).emit('list:setOwnerId', usersList.userFbId);
        }
      })
      .then(() => {
        socketUsers.set(socket.id, {listId: list.id, userId: user.fbId});

        Lists.getAllUsers(listId)
          .then((users) => {
            return getFacebookProfileInfoForUsers(users, listId, socketUsers);
          })
          .then((fbUsers) => {
            const viewerUser =
              fbUsers.find((fbUser) => fbUser.fbId === user.fbId);
            socket.join(list.id);
            socket.in(list.id).emit('user:join', viewerUser);

            userSocket.emit('init', {
              ...list,
              items,
              users: fbUsers,
              ownerId: listOwner ? listOwner.fbId : user.fbId,
            });

            sendStatus('ok');
          });
      });
  });
};

// Notify users in room when user leaves.
const leave = ({userId, listId, allInRoom, socket, socketUsers}) => {
  if (!userId) {
    console.error('User not registered to socket');
    return;
  }

  socketUsers.delete(socket.id);

  // Detect online status via socketUser with matching list & FB IDs.
  const onlineUsers =
    [...socketUsers.values()].reduce((onlineUsers, socketUser) => (
      (socketUser.listId === listId)
        ? [...onlineUsers, socketUser.userId]
        : onlineUsers
  ), []);

  allInRoom(listId).emit('users:setOnline', onlineUsers);
};

export default {join, leave};
