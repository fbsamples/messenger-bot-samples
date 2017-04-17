/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import ReactDOM from 'react-dom';
import {Toast} from 'react-weui';

// Simple loading spinner

const Loading = ({text = 'Loading...'}) => {
  return <Toast show icon='loading'>{text}</Toast>;
};

Loading.propsTypes = {
  text: React.PropTypes.string,
};

export default Loading;
