/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';

/*
 * MessengerExtensions are only available on iOS and Android,
 * so show an error page if MessengerExtensions was unable to start
 */
const Oops = () => {
  return (
    <div id='oops'>
      <div id='oops-body'>
        <h1>Viewing Outside Messenger App</h1>

        <div id='oops-subtitle'>
          <p>It looks like you're viewing this list outside of the Messenger app. This experience has been designed to work within the app on iOS or Android.</p>
          <br />
          <p>Head over to the Messenger app on your mobile device for a better experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Oops;
