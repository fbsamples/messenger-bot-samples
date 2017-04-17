/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe} from 'mocha';
import {expect} from 'chai';

import {dateString} from '../../utils/date-string-format';

describe('dateString', () => {
  describe('formats dates', () => {
    expect(dateString('1999-01-01')).to.equal('January 1st');
    expect(dateString('1999-05-02')).to.equal('May 2nd');
    expect(dateString('1999-05-03')).to.equal('May 3rd');
    expect(dateString('1999-05-04')).to.equal('May 4th');
    expect(dateString('1999-05-21')).to.equal('May 21st');
    expect(dateString('1999-05-22')).to.equal('May 22nd');
    expect(dateString('1999-05-23')).to.equal('May 23rd');
    expect(dateString('1999-05-24')).to.equal('May 24th');
  });

  describe('appends year on flag', () => {
    expect(dateString('1999-01-01', true)).to.equal('January 1st, 1999');
    expect(dateString('1999-05-02', true)).to.equal('May 2nd, 1999');
    expect(dateString('1999-05-03', true)).to.equal('May 3rd, 1999');
    expect(dateString('1999-05-04', true)).to.equal('May 4th, 1999');
    expect(dateString('1999-05-21', true)).to.equal('May 21st, 1999');
    expect(dateString('1999-05-22', true)).to.equal('May 22nd, 1999');
    expect(dateString('1999-05-23', true)).to.equal('May 23rd, 1999');
    expect(dateString('1999-05-24', true)).to.equal('May 24th, 1999');
  });
});
