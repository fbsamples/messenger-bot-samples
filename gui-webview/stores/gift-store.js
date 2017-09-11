/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== STORES ================================================================
import Store from './store';

// ===== MODELS ================================================================
import Gift from '../models/gift';

const SERVER_URL = process.env.SERVER_URL;
const [MOISTURIZER, CLEANER, MASK, LIP] = Gift.CATEGORIES;

/**
 * Stores data for the Gifts we display to users
 */
class GiftStore extends Store {
  /**
   * Gets all gifts matching the given category
   *
   * @param {String} categoryId category to filter by
   * @returns {Object[]} all gifts matching the given category
   */
  getByCategoryId(categoryId) {
    /**
     * Maps don't have a filter method (nor map, reduce, and so on)
     * Rather than write our own, here we convert to an Array
     * and leverage the build-in filter method.
     */
    return [...this.data.values()]
      .filter((gift) => gift.category === categoryId);
  }

  /**
   * Inserts a gift to the Store using the gifts id as the key
   *
   * @param {Object} gift Gift to insert
   * @returns {Object} The inserted gift
   */
  insert(gift) {
    return this.set(gift.id, gift);
  }
}

/**
 * Initialize the global Gift Store and populate with Gifts for the demo
 */
const GIFT_STORE = new GiftStore();

/* eslint-disable max-len */
GIFT_STORE.insert(
  new Gift(
    'moisturizers-kara',
    'VB Cream',
    {
      original: `${SERVER_URL}/media/moisturizers/kara-new.jpg`,
      square: `${SERVER_URL}/media/moisturizers/kara-square.jpg`,
    },
    'A light, non-greasy formula, providing effective and refreshing hydration.',
    MOISTURIZER,
    1.59,
  ));

GIFT_STORE.insert(
  new Gift(
    'moisturizers-softening',
    'Softening Cream',
    {
      original: `${SERVER_URL}/media/moisturizers/softening-new.jpg`,
      square: `${SERVER_URL}/media/moisturizers/softening-square.jpg`,
    },
    'A rich, creamy moisturizer that smooths & softens extremely dry skin.',
    MOISTURIZER,
    8.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'moisturizers-revitalizing',
    'Revitalizing Cream',
    {
      original: `${SERVER_URL}/media/moisturizers/revitalizing-new.jpg`,
      square: `${SERVER_URL}/media/moisturizers/revitalizing-square.jpg`,
    },
    'Super Revitalizing Cream reveals beautifully resilient-looking skin.',
    MOISTURIZER,
    12.49,
  ));

GIFT_STORE.insert(
  new Gift(
    'cleansers-lathering',
    'Lathering Cleanser',
    {
      original: `${SERVER_URL}/media/cleansers/lathering-new.jpg`,
      square: `${SERVER_URL}/media/cleansers/lathering-square.jpg`,
    },
    'A rich lathering cleanser to purify and hydrate all skin types.',
    CLEANER,
    32.22,
  ));

GIFT_STORE.insert(
  new Gift(
    'cleansers-refining',
    'Refining Cleanser',
    {
      original: `${SERVER_URL}/media/cleansers/refining-new.jpg`,
      square: `${SERVER_URL}/media/cleansers/refining-square.jpg`,
    },
    'An energizing cleanser that removes impurities and dead skin cells for a more refined skin texture.',
    CLEANER,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'cleansers-kara',
    'VB Cleanser',
    {
      original: `${SERVER_URL}/media/cleansers/kara-new.jpg`,
      square: `${SERVER_URL}/media/cleansers/kara-square.jpg`,
    },
    'A daily foaming cleanser that promotes visibly clearer skin without drying.',
    CLEANER,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'masks-kara',
    'Belle Mask',
    {
      original: `${SERVER_URL}/media/masks/kara-new.jpg`,
      square: `${SERVER_URL}/media/masks/kara-square.jpg`,
    },
    'Deeply cleanse your skin with our purifying and balancing seaweed oil clay mask.',
    MASK,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'masks-hydrating',
    'Hydrating Mask',
    {
      original: `${SERVER_URL}/media/masks/hydrating-new.jpg`,
      square: `${SERVER_URL}/media/masks/hydrating-square.jpg`,
    },
    'Hydrates and soothes, while leaving skin feeling fresh thanks to its mineral rich formula and liquid gel texture.',
    MASK,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'masks-clay',
    'Clay Mask',
    {
      original: `${SERVER_URL}/media/masks/clay-new.jpg`,
      square: `${SERVER_URL}/media/masks/clay-square.jpg`,
    },
    'Help cleanse and nourish your skin with this clay mask infused with Lavender.',
    MASK,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'lip-kara',
    'Victoria B. Lip Butter',
    {
      original: `${SERVER_URL}/media/lip/kara-new.jpg`,
      square: `${SERVER_URL}/media/lip/kara-square.jpg`,
    },
    'An intensive, creamy moisturizer for lips with the zesty pink grapefruit essence.',
    LIP,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'lip-restorative',
    'Restorative Lip Balm',
    {
      original: `${SERVER_URL}/media/lip/restorative-new.jpg`,
      square: `${SERVER_URL}/media/lip/restorative-square.jpg`,
    },
    'A restorative formula that hydrates lips while softening and smoothing for a beautiful, healthy-looking smile',
    LIP,
    1.99,
  ));

GIFT_STORE.insert(
  new Gift(
    'lip-hydrating',
    'Hydrating Lip Butter',
    {
      original: `${SERVER_URL}/media/lip/hydrating-new.jpg`,
      square: `${SERVER_URL}/media/lip/hydrating-square.jpg`,
    },
    'A mixture of Shea Butter and Rice Wax offers deep hydration and softness.',
    LIP,
    1.99,
  ));
/* eslint-enable max-len */

export default GIFT_STORE;
