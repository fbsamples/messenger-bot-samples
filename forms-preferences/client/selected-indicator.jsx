/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import {Icon} from 'react-weui';

// A selection indicator (checkmark). Largely used for radio buttons in this app.

export default ({on}) => {
  const imageName = on ? 'radio-filled.svg' : 'unchecked.svg';
  const imagePath = `/media/ui/${imageName}`;

  return (
    <div className='indicator'>
      <img src={imagePath} />
    </div>
  );
};
