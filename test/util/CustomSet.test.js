'use strict';

const CustomSet = require( '../../src/util/CustomSet').default;

const expect = require('chai').expect;
const assert = require('assert');

const describe       = require('mocha').describe;
const it            = require('mocha').it;

describe('CustomSet', function () {

  // add single
  it('should add a single item', function () {
    const customSet = new CustomSet();

    customSet.add(5);
    expect(customSet.size()).to.equal(1);
  });

  // add list
  it('should add a list of items', function () {
    const items = [0, 1, 2, 3, 4];
    const customSet = new CustomSet();

    customSet.add(items);

    expect(customSet.size()).to.equal(5);
  });

  // delete single
  it('should delete a single item', function () {
    const items = [0, 1, 2, 3, 4];
    const customSet = new CustomSet();

    customSet.add(items);
    customSet.delete(4);

    expect(customSet.size()).to.equal(4);
  });

  // delete list
  it('should delete a the last four items from CustomSet', function () {
    const items = [0, 1, 2, 3, 4];
    const customSet = new CustomSet();

    customSet.add(items);
    customSet.delete(items.slice(1, items.length));

    expect(customSet.size()).to.equal(1);
  });

  // has
  it('should return true if CustomSet contains element or false otherwise', function () {
    const items = [0];
    const customSet = new CustomSet();

    customSet.add(items);

    expect(customSet.has(0)).to.equal(true);
    expect(customSet.has(-1)).to.equal(false);
  });

  // equals
  it('testing equals method', function () {
    const items = [0, 1, 2, 3, 4];
    const customSet = new CustomSet();
    const equalSet = new CustomSet();
    const notEqualSet = new CustomSet();

    customSet.add(items);
    equalSet.add(items);
    notEqualSet.add(items.slice(0, 1));

    const isEqual = customSet.equals(equalSet);
    const isNotEqual = !customSet.equals(notEqualSet);

    expect(isEqual).to.equal(true);
    expect(isNotEqual).to.equal(true);
  });
});