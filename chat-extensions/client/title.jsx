/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== External Libraries ====================================================
import React from 'react';
import {Input} from 'react-weui';
import PropTypes from 'prop-types';

// List title field
const Title = ({text, setTitleText}) => {
  return (
    <div id='title'>
      <Input
        value={text}
        placeholder='List Title'
        onChange={(event) => setTitleText(event.target.value)}
      />
    </div>
  );
};

Title.propTypes = {
  text: PropTypes.string,
  setTitleText: PropTypes.func.isRequired,
};

export default Title;
