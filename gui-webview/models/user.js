/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODELS ================================================================
import Gift from './gift';

// ===== STORES ================================================================
import GiftStore from '../stores/gift-store';

/**
 * User Model
 *
 * @class User
 */
export default class User {
  /**
   * @property {Array.<string>} - Time since an item has become available
   */
  static ARRIVAL_PERIODS = [
    'thirtyDays',
    'sixtyDays',
    'soon',
  ];

  /**
   * @property {Array.<string>} - Skin types
   */
  static SKIN_TYPES = [
    'acne',
    'oil',
    'tone',
    'wrinkles',
    'sensitive',
    'tightDehydration',
    'flakyDehydration',
    'scars',
  ];

  /**
   * @property {Array.<string>} - Level of humidity in environment
   */
  static ENVIRONMENTS = [
    'dry',
    'normal',
    'humid',
  ];

  /**
   * @property {Array.<string>} - Defaults attributes for users
   */
  static DEFAULT_ATTRIBUTES = {
    dateOfBirth: '2017-01-01',
    giftCategory: Gift.CATEGORIES[0],
    arrivalPeriod: User.ARRIVAL_PERIODS[0],
    environment: User.ENVIRONMENTS[1],
    skinTypes: [],
  };

  /* eslint-disable max-len */
  /**
   * @constructor
   *
   * @param {object} attributes)
   * @param {string} attributes.id - Messenger Page Scoped User ID ('psid')
   * @param {string} attributes.dateOfBirth - Date of birth formatted YYYY-MM-DD
   * @param {string} attributes.environment - User's environment (from `User.ENVIRONMENTS`)
   * @param {string} attributes.skinTypes - User's skin type (from `User.SKIN_TYPES`)
   * @param {string} attributes.giftCategory -
   *   Preferred type of gift (from `Gift.CATEGORIES`)
   * @param {string} attributes.arrivalPeriod -
   *   How recently a gift should have been released (from `User.ARRIVAL_PERIODS`)
   */
   /* eslint-enable max-len */
  constructor(attributes) {
    const {
      id,
      dateOfBirth,
      giftCategory,
      arrivalPeriod,
      environment,
      skinTypes,
    } = Object.assign({}, User.DEFAULT_ATTRIBUTES, attributes);

    this.id = id;
    this.dateOfBirth = dateOfBirth;
    this.giftCategory = giftCategory;
    this.arrivalPeriod = arrivalPeriod;
    this.environment = environment;
    this.skinTypes = skinTypes;
    this.preferredGift = GiftStore.getByCategoryId(giftCategory)[0];
  }

  /**
   * Get all gifts matching the users giftCategory
   *
   * @returns {Object[]} All gifts matching the users giftCategory
   */
  getRecommendedGifts() {
    return GiftStore.getByCategoryId(this.giftCategory);
  }

  /**
   * Set the users preferredGift to the gift matching the id
   *
   * @param {String} giftId Id of the gift to set as the users preferred gift.
   * @returns {undefined}
   * @memberOf User
   */
  setPreferredGift(giftId) {
    this.preferredGift = GiftStore.get(giftId);
  }
}
