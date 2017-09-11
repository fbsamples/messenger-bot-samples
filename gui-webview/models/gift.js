/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Gift Model
 *
 * @class Gift
 */
export default class Gift {
  /**
   * @property {Array.<string>} - Available gift categories
   */
  static CATEGORIES = [
    'moisturizer',
    'cleanser',
    'mask',
    'lipTreatment',
  ];

  /**
   * Create a Gift
   *
   * @param {string} id - Unique idenitifier of this gift.
   * @param {string} name - Human readable gift name.
   * @param {object} images - Path to images.
   * @param {object} images.original - Full size image.
   * @param {object} images.square - Square cropped image.
   * @param {string} description - Description of the gift.
   * @param {string} category - Category of this gift (`Gift.CATEGORIES`).
   */
  constructor(id, name, images, description, category, price) {
    this.id = id;
    this.name = name;
    this.images = images;
    this.description = description;
    this.category = category;
    this.price = price;
  }
}
