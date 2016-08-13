'use strict';

const CommentMethods  = require( '../../src/models/Comment').default.schema.statics;
const Comment = require( '../../src/models/Comment').default;
const commentsSuccess = require('../test-data/comments').successCases;
const commentsFailure = require('../test-data/comments').failureCases;

const expect = require('chai').expect;
const assert = require('assert');
var mongoose = require('mongoose');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfComments = commentsSuccess.length;

describe('Comment', function () {

  // wipe all data
  before(function (done) {
    Comment.remove({})
    .then(() => {
      console.log('Comment collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  commentsSuccess.forEach(comment => {
    it(`should create and insert ${comment.title}`, function (done) {
      const meta = comment.meta || {};
      meta.dateCreated = Date.now();
      comment.meta = meta;
      comment.parent = mongoose.Types.ObjectId();
      comment.authors = [mongoose.Types.ObjectId()];
      return CommentMethods.createComment(comment)
      .then(comment => done())
      .catch(err => done(err));
    });
  });

  it(`getComment should return ${numberOfComments}, the number of comments in comments.json`, function (done) {
    CommentMethods.getComment()
    .then(function (result) {
      expect(result.length).to.equal(numberOfComments);
      done();
    })
    .catch(err => done(err));
  });

  it('getComment should return no result', function (done) {
    CommentMethods.getComment({title: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
