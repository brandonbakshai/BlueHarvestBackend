'use strict';

const StoryMethods  = require( '../../src/models/Story').default.schema.statics;
const Story         = require( '../../src/models/Story').default;
const storiesSuccess = require('../test-data/stories').successCases;
const storiesFailure = require('../test-data/stories').failureCases;

const expect = require('chai').expect;
const assert = require('assert');

var mongoose = require('mongoose');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfStories = storiesSuccess.length;

describe('Story', function () {
  before(function (done) {
    Story.remove({})
    .then(() => {
      console.log('Story collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  storiesSuccess.forEach(story => {
    it(`should create and insert ${story.title}`, function (done) {
      const meta = story.meta || {};
      meta.dateCreated = Date.now();
      story.meta = meta;
      story.author = mongoose.Types.ObjectId();
      StoryMethods.createStory(story)
      .then(story => done())
      .catch(err => done(err));
    });
  });

  it(`getStory should return ${numberOfStories}, the number of stories in stories.json`, function (done) {
    StoryMethods.getStory()
    .then(function (result) {
      expect(result.length).to.equal(numberOfStories);
      done();
    })
    .catch(err => done(err));
  });

  it('getStory should return no result', function (done) {
    StoryMethods.getStory({name: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});

