'use strict';

const MajorPost = require( '../../src/models/MajorPost').default;
const MajorPostMethods = MajorPost.schema.statics;

const majorPostsSuccess = require('../test-data/majorPosts').successCases;
const majorPostsFailure = require('../test-data/majorPosts').failureCases;
const numberOfMajorPosts = majorPostsSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('MajorPost', function () {

  // wipe all data
  before(utilityMethods.wipeCollection(MajorPost));

  // createItem success case
  majorPostsSuccess.forEach(post => {
    it(`should create and insert ${post.title}`, function (done) {
      post.authors = [mongoose.Types.ObjectId()];
      post.bounty = mongoose.Types.ObjectId();
      MajorPostMethods.createItem(post)
      .then(post => done())
      .catch(err => done(err));
    });
  });

  // createItem failure case
  majorPostsFailure.forEach(post => {
    it(`should fail on insert of ${post.title}`, function (done) {
      post.authors = [mongoose.Types.ObjectId()];
      return MajorPostMethods.createItem(post)
      .then(() => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  // getItems
  it(`getMajorPost should return ${numberOfMajorPosts}, the number of majorPosts in majorPosts.json`,
    utilityMethods.getItems(MajorPostMethods, {}, numberOfMajorPosts, done));

  // getItems
  it('getMajorPost should return no result',
    utilityMethods.getItems(MajorPostMethods, { name: 'blah' }, 0, done));
});
