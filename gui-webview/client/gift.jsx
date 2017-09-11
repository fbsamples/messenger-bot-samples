/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';
import 'whatwg-fetch';
import {
  Button,
  ButtonArea,
} from 'react-weui';

/* ----------  Internal Imports  ---------- */

import WebviewControls from '../messenger-api-helpers/webview-controls';
import purchase from './purchase';
import logger from './fba-logging';

const selectGift = (giftId, userId) => {
  logger.fbLog('select_gift_start', {gift_id: giftId}, userId);
  fetch(`/users/${userId}/gift/${giftId}`, {
    method: 'PUT',
  }).then((response) => {
    if (response.ok) {
      logger.fbLog('select_gift_success', {gift_id: giftId}, userId);
      return;
    }
    logger.fbLog('select_gift_error', {gift_id: giftId}, userId);
    console.error(
      response.status,
      `Unable to save gift for User ${userId}'`
    );
  }).catch((err) => console.error('Error pushing data', err)).then(() => {
    WebviewControls.close();
  });
};

const buyNow = (giftId, userId) => {
  logger.fbLog('payment_step', {step: "start_purchase", gift_id: giftId}, userId);
  purchase.buyItem(giftId, userId);
};

/*
 * A component for displaying the Product details for a given product
 */
const Gift = ({id, name, images, description, userId}) => {
  return (
    <div>
      <div id='product' className='static-page'>
        <div className='static-page-body'>
          <div className='product-body'>
            <img className='product-image' src={images.square}/>
            <div className='product-details'>
              <h1>{name}</h1>
              <p className='static-page-subtitle'>{description}</p>
            </div>
          </div>
        </div>
      </div>
      <ButtonArea className='see-options' direction='horizontal'>
        <Button onClick={() => selectGift(id, userId)}>
          Choose Gift
        </Button>
        <Button onClick={() => buyNow(id, userId)}>
          Buy Now
        </Button>
      </ButtonArea>
    </div>
  );
};

export default Gift;
