/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import React, {createElement} from 'react';
import {Cell, CellBody, CellHeader, Input} from 'react-weui';

const SCROLL_DURATION = 1000; // total duration in ms for scroll animation.

/**
 * lockScroll — Force scrollY position to bottom of viewport for duration.
 * @param   {Number} startTime - Start Time for locking scroll duration.
 * @returns {Undefined} .
 */
const lockScroll = (startTime) => {
  const deltaTime = Date.now() - startTime;
  const htmlElement = document.documentElement;
  const {scrollTo, scrollX, innerHeight} = window;

  scrollTo(scrollX, htmlElement.offsetHeight - innerHeight);

  if (deltaTime <= SCROLL_DURATION) {
    window.requestAnimationFrame(() => lockScroll(startTime));
  }
};

// The NewItem Input Field Component
const NewItem = ({
  addNewItem,
  disabled,
  newItemText,
  resetting,
  setNewItemText,
}) => {
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled && newItemText.length > 0) {
      addNewItem();
      lockScroll(Date.now());
    }
  };

  const classes = resetting ? 'resetting' : null; // For wipe animation

  return (
    <Cell id='new-item'>
      <CellHeader id='input-indicator' onClick={onSubmit}>
        <div className='weui-uploader__input-box' />
      </CellHeader>

      <CellBody>
        {/* Empty action attr enables 'Go' Submit Button on iOS Keyboard */}
        <form action onSubmit={onSubmit}>
          <Input
            className={classes}
            disabled={disabled}
            id='new-item-text'
            onBlur={onSubmit}
            onChange={(event) => setNewItemText(event.target.value)}
            placeholder='Add an item to the list'
            type='text'
            value={newItemText}
          />
        </form>
      </CellBody>
    </Cell>
  );
};

NewItem.proptypes = {
  addNewItem: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  newItemText: React.PropTypes.string,
  setNewItemText: React.PropTypes.func.isRequired,
};

export default NewItem;
