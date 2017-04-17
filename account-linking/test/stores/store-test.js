/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe} from 'mocha';
import {expect} from 'chai';

import Store from '../../stores/store';

describe('Store', () => {
  describe('can insert', () => {
    const InitializedStore = new Store();
    expect(InitializedStore.data.size).to.equal(0);
    InitializedStore.set('KEY', 'value');
    expect(InitializedStore.data.size).to.equal(1);
    expect(InitializedStore.has('key')).to.be.true;
  });

  describe('can delete', () => {
    const InitializedStore = new Store();
    InitializedStore.set('KEY', 'value');
    expect(InitializedStore.data.size).to.equal(1);
    InitializedStore.delete('key');
    expect(InitializedStore.data.size).to.equal(0);
    expect(InitializedStore.has('KEY')).to.be.false;
  });

  describe('can reset', () => {
    const InitializedStore = new Store();
    InitializedStore.set('KEY1', 'value');
    InitializedStore.set('KEY2', 'value');
    InitializedStore.set('KEY3', 'value');
    expect(InitializedStore.data.size).to.equal(3);
    InitializedStore.reset();
    expect(InitializedStore.data.size).to.equal(0);
  });
});
