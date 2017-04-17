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

describe('User model', () => {
  const {ENVIRONMENTS, SKIN_TYPES, ARRIVAL_PERIODS} = User;

  const user = new User({
    id: 'abcdefghijklmnop',
    dateOfBirth: '1986-09-29',
    giftCategory: Gift.CATEGORIES[2],
    arrivalPeriod: ARRIVAL_PERIODS[1],
    environment: ENVIRONMENTS[1],
    skinTypes: [
      SKIN_TYPES[1],
      SKIN_TYPES[3],
      SKIN_TYPES[5],
    ],
  });

  describe('#constructor', () => {
    describe('pseudo-enums', () => {
      expect(user.arrivalPeriod).to.equal('sixtyDays');
      expect(user.environment).to.equal(ENVIRONMENTS[1]);
      expect(user.skinTypes).to.include('oil');
      expect(user.skinTypes).to.include('wrinkles');
      expect(user.skinTypes).to.include('tightDehydration');
    });
  });
});
