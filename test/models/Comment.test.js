'use strict';

const Comment = require( '../../src/models/Comment').default;
const CommentMethods  = Comment.schema.statics;

const commentsSuccess = require('../test-data/comments').successCases;
const commentsFailure = require('../test-data/comments').failureCases;
const numberOfComments = commentsSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Comment', function () {

  // wipe all data
  before(utilityMethods.wipeCollection(Comment));

  /* createItem */

  commentsSuccess.forEach(comment => {
    it(`should create and insert ${comment.title}`, function (done) {
      comment.parent = mongoose.Types.ObjectId();
      comment.authors = [mongoose.Types.ObjectId()];
      return CommentMethods.createItem(comment)
      .then(comment => done())
      .catch(err => done(err));
    });
  });

  commentsFailure.forEach(comment => {
    it(`should fail on insert of ${comment.title}`, function (done) {
      bounty.authors = [mongoose.Types.ObjectId()];
      return CommentMethods.createItem(bounty)
      .then(() => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  /* getItems */
  it(`getItems should return ${numberOfComments}, the number of comments in comments.json`,
    utilityMethods.getItems(CommentMethods, {}, numberOfComments, done));

  it('getItems should return no result',
    utilityMethods.getItems(CommentMethods, { title: 'blah' }, numberOfComments, done));
});
