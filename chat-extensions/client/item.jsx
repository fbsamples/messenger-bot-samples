/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */
import React from 'react';
import {CellBody, CellFooter, CellHeader, Checkbox, FormCell} from 'react-weui';
import PropTypes from 'prop-types';

/*
 * A single list item, including controls
 */
const Item = ({
  id,
  name,
  viewerId,
  pushUpdatedItem,
  completerFbId,
  ownerFbId,
  users,
}) => {
  const actorId = completerFbId || ownerFbId;
  const user = users.find((user) => user.fbId === actorId);
  const {name: attribution} = user;
  let action = 'Added';
  let toComplete = viewerId;
  let classes;

  if (completerFbId) {
    action = 'Completed';
    classes = 'complete';
    toComplete = null;
  }

  return (
    <FormCell checkbox className='item'>
      <CellHeader>
        <Checkbox
          name={`item-${id}`}
          checked={!!completerFbId}
          onChange={() => pushUpdatedItem(id, name, toComplete)}
        />
      </CellHeader>

      <CellBody className={classes}>{name}</CellBody>

      <CellFooter>{action} by {attribution}</CellFooter>
    </FormCell>
  );
};

Item.PropTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  viewerId: PropTypes.string.isRequired,
  pushUpdatedItem: PropTypes.func.isRequired,
  ownerFbId: PropTypes.string.isRequired,
  completerFbId: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default Item;
