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
 * Handle the case when a user requests a list that doesn't exist.
 *
 * Typically occurs when they follow an old link from before the app was spun up.
 */
const ListNotFound = () => {
  return (
    <div id='oops'>
      <div id='oops-body'>
        <h1>List Not Found</h1>

        <div id='oops-subtitle'>
          <p>Sorry, we couldn't find the list you were looking for.</p>
          <br />
          <p>We apologize for the inconvenience.</p>
        </div>
      </div>
    </div>
  );
};

export default ListNotFound;
