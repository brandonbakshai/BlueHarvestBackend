'use strict';

const PostMethods  = require( '../../src/models/Post').default.schema.statics;
const Post = require( '../../src/models/Post').default;
const postsSuccess = require('../test-data/posts').successCases;

const expect = require('chai').expect;
var mongoose = require('mongoose');

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Post', function () {

  // wipe all data and enter test data
  before(function (done) {
    Post.remove({})
    .then(() => {
      return Promise.all(postsSuccess.map(post => {
        post.authors = [mongoose.Types.ObjectId()];
        return new Post(post);
      }));
    })
    .then(posts => {
      return Promise.all(posts.map(post => post.save()));
    })
    .then(posts => {
      console.log(posts);
      console.log('test data successfully inserted');
      done();
    })
    .catch(err => done(err));
  });

  /* upvote */
  it(`should upvote a post once`, function (done) {
    Post.findOne({})
    .then(post => {
      expect(post.meta.upvotes).to.equal(0);
      return PostMethods.upvote(post);
    })
    .then(post => {
      expect(post.meta.upvotes).to.equal(1);
      done();
    })
    .catch(err => done(err));
  });

  /* downvote */
  it(`should downvote a post once`, function (done) {
    Post.findOne({})
    .then(post => {
      expect(post.meta.downvotes).to.equal(0);
      return PostMethods.downvote(post);
    })
    .then(post => {
      expect(post.meta.downvotes).to.equal(1);
      done();
    })
    .catch(err => done(err));
  });

  /* updateBody */
  it(`should update body of a post`, function (done) {
    Post.findOne({})
    .then(post => {
      return PostMethods.updateBody(post._id, { body: "oi" });
    })
    .then(post => {
      expect(post.body).to.equal("oi");
      done();
    })
    .catch(err => done(err));
  });
});
