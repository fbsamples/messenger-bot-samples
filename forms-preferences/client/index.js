/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';

/* ----------  Local Components  ---------- */

import App from './app.jsx';
import Oops from './oops.jsx';
import Gift from './gift.jsx';

/* ----------  Styles  ---------- */

import 'weui';
import 'react-weui/lib/react-weui.min.css';
import '../public/style.css';

// Simple initializer for attaching the Preferences App to the DOM
window.attachApp = (userId, gift) => {
  /**
   * MessengerExtensions are only available on iOS and Android,
   * so show an error page if MessengerExtensions was unable to start
   */
  if (userId) {
    const app = gift
      ? <Gift {...gift} userId={userId} />
      : <App userId={userId} />;
    ReactDOM.render(app, document.getElementById('content'));
  } else {
    ReactDOM.render(<Oops />, document.getElementById('content'));
  }
};

// Simple initializer for attaching the Gift Page to the DOM
window.attachGift = (gift, userId) => {
  /**
   * MessengerExtensions are only available on iOS and Android,
   * so show an error page if MessengerExtensions was unable to start
   */
  const app = userId
    ? <Gift {...gift} userId={userId} />
    : <Oops />;

  ReactDOM.render(app, document.getElementById('content'));
};
