/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe} from 'mocha';
import {expect} from 'chai';

import UserStore from '../../stores/user_store';

describe('UserStore', () => {
  describe('demo user added initially', () => {
    expect(UserStore.data.size).to.equal(1);
    expect(UserStore.has('dave')).to.be.true;
  });

  describe('can add user', () => {
    UserStore.insert('john', 'password');
    expect(UserStore.data.size).to.equal(2);
    expect(UserStore.has('john')).to.be.true;
  });

  describe('can update user', () => {
    expect(UserStore.get('john').password).to.equal('password');
    UserStore.update('john', {password: '1234'});
    expect(UserStore.get('john').password).to.equal('1234');
  });

  describe('can add messengerid', () => {
    UserStore.linkMessengerAccount('john', 'mess-id-1234');
    expect(UserStore.get('john').messengerId).to.equal('mess-id-1234');
  });

  describe('can replace messengerid', () => {
    UserStore.replaceAuthToken('mess-id-1234', 'new-mess-token');
    expect(UserStore.get('john').messengerId).to.equal('new-mess-token');
  });
});
