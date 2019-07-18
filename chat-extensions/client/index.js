/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */
// eslint-disable-next-line
import React from 'react';
import ReactDOM from 'react-dom';

/* ----------  Internal Components  ---------- */

import App from './app.jsx';
import Oops from './oops.jsx';

/* ----------  Stylesheets  ---------- */

import 'weui';
import 'react-weui/build/packages/react-weui.css';
import '../public/style.css';

/*
 * Function for attaching the application when MessengerExtensions has loaded
 */
window.attachApp = (viewerId, listId, socketAddress, threadType) => {
  const apiUri = `https://${window.location.hostname}`;
  let app;
  if (viewerId) {
    app = (
      // The main show
      <App
        viewerId={viewerId}
        listId={listId}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
      />
    );
  } else {
    /**
     * The Messenger Extension could not be initialized.
     * Maybe you forgot to whitelist your domain or the
     * user runs a very old version of Messenger.
     */
    app = <Oops />;
  }

  ReactDOM.render(app, document.getElementById('content'));
};
