/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import io from 'socket.io-client';
import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {Panel, Form} from 'react-weui';
import PropTypes from 'prop-types';

// ===== COMPONENTS ============================================================
import Invite from './invite.jsx';
import Item from './item.jsx';
import ListNotFound from './list_not_found.jsx';
import LoadingScreen from './loading_screen.jsx';
import NewItem from './new_item.jsx';
import Title from './title.jsx';
import Updating from './updating.jsx';
import Viewers from './viewers.jsx';

let socket;

/* =============================================
   =            React Application              =
   ============================================= */

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.pushUpdatedItem = this.pushUpdatedItem.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.setDocumentTitle = this.setDocumentTitle.bind(this);
    this.setItem = this.setItem.bind(this);
    this.setNewItemText = this.setNewItemText.bind(this);
    this.setOwnerId = this.setOwnerId.bind(this);
    this.setTitleText = this.setTitleText.bind(this);
    this.userJoin = this.userJoin.bind(this);
    this.setOnlineUsers = this.setOnlineUsers.bind(this);

    this.state = {
      items: [],
      newItemText: '',
      ownerId: null,
      resetting: false,
      title: this.props.title,
      updating: false,
      users: [],
    };
  }

  static defaultProps = {
    apiUri: PropTypes.string.isRequired,
    listId: PropTypes.number.isRequired,
    socketAddress: PropTypes.string.isRequired,
    viewerId: PropTypes.number.isRequired,
    threadType: PropTypes.string.isRequired,
  }

  /* =============================================
     =               Helper Methods              =
     ============================================= */

  /* ----------  Communicate with Server  ---------- */

  /*
   * Push a message to socket server
   * To keep things clear, we're distinguishing push events by automatically
   * prepending 'push:' to the channel name
   *
   * Returned responses have no prefix,
   * and read the same in the rest of the code
   */
  pushToRemote(channel, message) {
    this.setState({updating: true}); // Set the updating spinner

    socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.viewerId,
        listId: this.props.listId,
        ...message,
      },
      (status) => {
        // Finished successfully with a special 'ok' message from socket server
        if (status !== 'ok') {
          console.error(
            `Problem pushing to ${channel}`,
            JSON.stringify(message)
          );
        }

        this.setState({
          socketStatus: status,
          updating: false, // Turn spinner off
        });
      }
    );
  }

  /* ----------  Update Document Attributes  ---------- */

  setDocumentTitle(title = 'Shopping List') {
    console.log('Updating document title (above page):', title);
    document.title = title;
  }

  /* =============================================
     =           State & Event Handlers          =
     ============================================= */

  /* ----------  List  ---------- */

  // For the initial data fetch
  setOwnerId(ownerId) {
    console.log('Set owner ID:', ownerId);
    this.setState({ownerId});
  }

  setTitleText(title) {
    console.log('Push title to remote:', title);
    this.setState({title});
    this.setDocumentTitle(title);
    this.pushToRemote('title:update', {title});
  }

  /* ----------  Users  ---------- */

  // Socket Event Handler for Set Online Users event.
  setOnlineUsers(onlineUserFbIds = []) {
    const users = this.state.users.map((user) => {
      const isOnline =
        onlineUserFbIds.find((onlineUserFbId) => onlineUserFbId === user.fbId);

      return Object.assign({}, user, {online: isOnline});
    });

    this.setState({users});
  }

  // Socket Event Handler for User Join event.
  userJoin(newUser) {
    const oldUsers = this.state.users.slice();
    const existing = oldUsers.find((user) => user.fbId === newUser.fbId);

    let users;
    if (existing) {
      users = oldUsers.map((user) =>
        (user.fbId === newUser.fbId)
        ? newUser
        : user
      );
    } else {
      oldUsers.push(newUser);
      users = oldUsers;
    }

    this.setState({users});
  }

  /* ----------  Items  ---------- */

  addItem(item) {
    this.setState({items: [...this.state.items, item]});
  }

  pushUpdatedItem(itemId, name, completerFbId) {
    this.pushToRemote('item:update', {id: itemId, name, completerFbId});
  }

  setItem({id, name, completerFbId}) {
    const items = this.state.items.map((item) =>
      (item.id === id)
        ? Object.assign({}, item, {id: id, name, completerFbId})
        : item
    );

    this.setState({items});
  }

  /* ----------  New Item Field  ---------- */

  setNewItemText(newText) {
    console.log('Set new item text:', newText);
    this.setState({newItemText: newText});
  }

  // Turn new item text into an actual list item
  addNewItem() {
    const {newItemText: name} = this.state;

    this.resetNewItem();
    this.pushToRemote('item:add', {name});
  }

  resetNewItem() {
    this.setState({resetting: true});

    setTimeout(() => {
      this.setState({newItemText: '', resetting: false});
    }, 600);
  }

  /* =============================================
     =              React Lifecycle              =
     ============================================= */

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      this.props.socketAddress,
      {reconnect: true, secure: true}
    );

    // Add socket event handlers.
    socket.on('init', ({users, items, ownerId, title} = {}) => {
      this.setState({users, items, ownerId, title});
    });

    socket.on('item:add', this.addItem);
    socket.on('item:update', this.setItem);
    socket.on('list:setOwnerId', this.setOwnerId);
    socket.on('title:update', this.setDocumentTitle);
    socket.on('user:join', this.userJoin);
    socket.on('users:setOnline', this.setOnlineUsers);

    const self = this;
    // Check for permission, ask if there is none
    window.MessengerExtensions.getGrantedPermissions(function(response) {
      // check if permission exists
      const permissions = response.permissions;
      if (permissions.indexOf('user_profile') > -1) {
        self.pushToRemote('user:join', {id: self.props.viewerId});
      } else {
        window.MessengerExtensions.askPermission(function(response) {
          const isGranted = response.isGranted;
          if (isGranted) {
            self.pushToRemote('user:join', {id: self.props.viewerId});
          } else {
            window.MessengerExtensions.requestCloseBrowser(null, null);
          }
        }, function(errorCode, errorMessage) {
          console.error({errorCode, errorMessage});
          window.MessengerExtensions.requestCloseBrowser(null, null);
        }, 'user_profile');
      }
    }, function(errorCode, errorMessage) {
      console.error({errorCode, errorMessage});
      window.MessengerExtensions.requestCloseBrowser(null, null);
    });
  }

  render() {
    const {
      ownerId,
      items,
      users,
      title,
      resetting,
      newItemText,
      updating,
      socketStatus,
    } = this.state;

    let page;

    // Skip and show loading spinner if we don't have data yet
    if (users.length > 0) {
      /* ----------  Setup Sections (anything dynamic or repeated) ---------- */

      const {apiUri, listId, viewerId, threadType} = this.props;
      const itemList = items.filter(Boolean).map((item) => {
        return (
          <Item
            {...item}
            key={item.id}
            users={users}
            viewerId={viewerId}
            pushUpdatedItem={this.pushUpdatedItem}
          />
        );
      });

      let invite;
      const isOwner = viewerId === ownerId;
      if (isOwner || threadType !== 'USER_TO_PAGE') {
        // only owners are able to share their lists and other
        // participants are able to post back to groups.
        let sharingMode;
        let buttonText;

        if (threadType === 'USER_TO_PAGE') {
          sharingMode = 'broadcast';
          buttonText = 'Invite your friends to this list';
        } else {
          sharingMode = 'current_thread';
          buttonText = 'Send to conversation';
        }

        invite = (
          <Invite
            title={title}
            sharingMode={sharingMode}
            buttonText={buttonText}
            pushToRemote={this.pushToRemote}
          />
        );
      }

      let titleField;
      if (isOwner) {
        titleField = (
          <Title
            text={title}
            setTitleText={this.setTitleText}
          />
        );
      }

    /* ----------  Inner Structure  ---------- */
      page =
        (<section id='list'>
          <Viewers
            users={users}
            viewerId={viewerId}
          />

          <Panel>
            {titleField}

            <section id='items'>
              <Form checkbox>
                <ReactCSSTransitionGroup
                  transitionName='item'
                  transitionEnterTimeout={250}
                  transitionLeaveTimeout={250}
                >
                  {itemList}
                </ReactCSSTransitionGroup>
              </Form>

              <NewItem
                newItemText={newItemText}
                disabled={updating}
                resetting={resetting}
                addNewItem={this.addNewItem}
                setNewItemText={this.setNewItemText}
              />
            </section>
          </Panel>

          <Updating updating={updating} />

          {invite}
        </section>);
    } else if (socketStatus === 'noList') {
      // We were unable to find a matching list in our system.
      page = <ListNotFound/>;
    } else {
      // Show a loading screen until app is ready
      page = <LoadingScreen key='load' />;
    }

    /* ----------  Animated Wrapper  ---------- */

    return (
      <div id='app'>
        <ReactCSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {page}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
