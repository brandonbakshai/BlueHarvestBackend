'use strict';

const Story = require( '../../src/models/Story').default;
const StoryMethods  = Story.schema.statics;

const storiesSuccess = require('../test-data/stories').successCases;
const storiesFailure = require('../test-data/stories').failureCases;
const numberOfStories = storiesSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Story', function () {

  before(utilityMethods.wipeCollection(Story));

  storiesSuccess.forEach(story => {
    it(`should create and insert ${story.title}`, function (done) {
      story.authors = [mongoose.Types.ObjectId()];
      StoryMethods.createItem(story)
      .then(story => done())
      .catch(err => done(err));
    });
  });

  it(`getStory should return ${numberOfStories}, the number of stories in stories.json`,
    utilityMethods.getItems(StoryMethods, {}, numberOfStories, done));


  it('getStory should return no result',
    utilityMethods.getItems(StoryMethods, { name: 'blah' }, 0, done));
});

