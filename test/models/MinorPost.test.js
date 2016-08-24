'use strict';

const MinorPost = require( '../../src/models/MinorPost').default;
const MinorPostMethods  = MinorPost.schema.statics;

const minorPostsSuccess = require('../test-data/minorPosts').successCases;
const minorPostsFailure = require('../test-data/minorPosts').failureCases;
const numberOfMinorPosts = minorPostsSuccess.length;

const expect = require('chai').expect;
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('MinorPost', function () {

  // wipe all data and enter test data
  before(function (done) {
    MinorPost.remove({})
    .then(() => {
      console.log('MinorPosts successfully wiped');
      return Promise.all(minorPostsSuccess.map(minorPost => {
        minorPost.authors = [mongoose.Types.ObjectId()];
        return new MinorPost(minorPost);
      }));
    })
    .then(minorPosts => {
      return Promise.all(minorPosts.map(minorPost => minorPost.save()));
    })
    .then(() => {
      console.log('test data successfully inserted');
      done();
    })
    .catch(err => done(err));
  });

  // upvote
  it(`should upvote a minorPost once`, function (done) {
    MinorPost.findOne({})
    .then(minorPost => {
      expect(minorPost.meta.upvotes).to.equal(0);
      return MinorPostMethods.upvote(minorPost);
    })
    .then(minorPost => {
      expect(minorPost.meta.upvotes).to.equal(1);
      done();
    })
    .catch(err => done(err));
  });

  /* downvote */
  it(`should downvote a minorPost once`, function (done) {
    MinorPost.findOne({})
    .then(minorPost => {
      expect(minorPost.meta.downvotes).to.equal(0);
      return MinorPostMethods.downvote(minorPost);
    })
    .then(minorPost => {
      expect(minorPost.meta.downvotes).to.equal(1);
      done();
    })
    .catch(err => done(err));
  });

  /* updateData */
  it(`should update fields of a minorPost`, function (done) {
    MinorPost.findOne({})
    .then(minorPost => {
      return MinorPostMethods.updateBody(minorPost._id, { body: "oi" });
    })
    .then(minorPost => {
      expect(minorPost.body).to.equal("oi");
      done();
    })
    .catch(err => done(err));
  });
});
