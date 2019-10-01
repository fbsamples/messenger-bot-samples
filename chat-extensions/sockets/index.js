/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== SOCKETS ===============================================================
import ListSocket from './list-socket';
import UserSocket from './user-socket';

const socketUsers = new Map(); // {socketId: {userId, listId}}

export default function attachSockets(io) {
  io.on('connection', (socket) => {
    const allInRoom = (roomId) => io.sockets.in(roomId);
    const userSocket = io.sockets.connected[socket.id];

    const channel = (channel, handler) => {
      socket.on(channel, (request, sendStatus) => {
        const {userId, listId} = socketUsers.get(socket.id) || {};

        handler({
          allInRoom,
          listId,
          request,
          sendStatus,
          socket,
          socketUsers,
          userId,
          userSocket,
        });
      });
    };

    console.log(`A user connected (socket ID ${socket.id})`);

    channel('disconnect', UserSocket.leave);
    channel('push:item:add', ListSocket.addItem);
    channel('push:item:update', ListSocket.updateItem);
    channel('push:title:update', ListSocket.updateTitle);
    channel('push:share:list', ListSocket.shareList);
    channel('push:user:join', UserSocket.join);
  });
}
