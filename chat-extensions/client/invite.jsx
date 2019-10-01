/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';
import {Button} from 'react-weui';
import PropTypes from 'prop-types';

/*
 * Button to share list with friends
 */
const Invite = ({
  title,
  sharingMode,
  buttonText,
  pushToRemote
}) => {
  const shareList = () => {
    pushToRemote('share:list', {title});
    window.MessengerExtensions.requestCloseBrowser(null, null);
  };

  const iconClassName = sharingMode === 'broadcast' ? 'share' : 'send';

  return (
    <div id='invite'>
      <Button onClick={shareList}>
        <span className={`invite-icon ${iconClassName}`} />
        {buttonText}
      </Button>
    </div>
  );
};

Invite.PropTypes = {
  title: PropTypes.string,
  sharingMode: PropTypes.bool,
  buttonText: PropTypes.string,
  pushToRemote: PropTypes.func.isRequired,
};

export default Invite;
