/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe} from 'mocha';
import {expect} from 'chai';

import Gift from '../../models/gift';
import User from '../../models/user';
import UserStore from '../../stores/user-store';

describe('UserStore', () => {
  const {ENVIRONMENTS, ARRIVAL_PERIODS, SKIN_TYPES} = User;

  const user = UserStore.insert({
    id: '42',
    dateOfBirth: '1986-09-29',
    giftCategory: Gift.CATEGORIES[1],
    arrival_period: ARRIVAL_PERIODS[0],
    environment: ENVIRONMENTS[2],
    skinTypes: [
      SKIN_TYPES[0],
      SKIN_TYPES[2]
    ]
  });

  describe('#insert', () => {
    expect(UserStore.data.size).to.equal(1);

    expect(user.id).to.equal('42');
    expect(user.dateOfBirth).to.equal('1986-09-29');
    expect(user.giftCategory).to.equal(Gift.CATEGORIES[1]);
    expect(user.arrivalPeriod).to.equal(User.ARRIVAL_PERIODS[0]);
    expect(user.environment).to.equal(User.ENVIRONMENTS[2]);

    expect(user.skinTypes).to.include('acne');
    expect(user.skinTypes).to.include('tone');
  });

  describe('#get', () => {
    expect(UserStore.get(user.id)).to.equal(user);
  });

  describe('#delete', () => {
    expect(UserStore.delete(user.id).deleted.id).to.equal(user.id);
    expect(UserStore.data.size).to.equal(0);
  });
});
