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
 * Messenger native payments require a link to your company
 * terms & conditions page.
 */
const TermsAndConditions = () => {
  return (
    <div className='static-page'>
      <div className='static-page-body'>
        <h1>Victoria Belle Terms & Conditions</h1>

        <div className='static-page-subtitle'>
          <p>Sample terms & conditions page.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
