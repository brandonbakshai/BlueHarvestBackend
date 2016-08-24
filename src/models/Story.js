'use strict';

import db from './db.js';
import requestPromise from 'request-promise';
import Public from './Public';
import CustomSet from '../util/CustomSet';

const Schema = db.Schema;
const StorySchema = new Schema({
  comments: {
    type: [Schema.ObjectId],
    ref: 'Comment',
  },
  url: {
    type: String,
    required: true
  }
});

// create
StorySchema.statics.createItem = createItem;

// get
StorySchema.statics.getItems = getItems;
StorySchema.statics.getFreshStories = getFreshStories;

// update
StorySchema.statics.addComments = addComments;
StorySchema.statics.removeComments = removeComments;

const Story = Public.discriminator('Story', StorySchema);

/**
 * Returns promise to create Story backed by argument and insert into the db
 * @param story object containing specification for Story instance
 * @returns {Promise|*}
 */
function createItem(story) {
  const storyToInsert = new Story(story);
  return storyToInsert.save();
}

/**
 * Method returning promise to query bing news search api and insert all data as Story in mongodb instance
 * @returns {Promise|Promise.<T>}
 */
function getFreshStories() {
  return requestPromise({
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/news/?Category=ScienceAndTechnology', //URL to hit
    method: 'GET', //Specify the method
    Host: '73.97.20.242:3000',
    headers: { //We can define headers too
      'Ocp-Apim-Subscription-Key': '95027e1a75fc4e1fafe86b6256e874e5',
      'Content-Type': 'application/json'
    },
    json: true,
  })
  .then((body) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const promisesArray = body.values.map(value => buildStory(value));
    return Promise.all(promisesArray);
  });
}

/**
 * Helper method given a json representation of a Story object which returns a promise to insert that object into the db
 * @param jsonValues json representation of Story object
 * @returns {Promise|*} Promise to insert the story object into the db
 */
function buildStory(jsonValues) {
  const image = jsonValues.image || {};
  const thumbnail = image.thumbnail || {};
  const story = {
    title: jsonValues.name,
    content: {
      text:  {
        body: jsonValues.description
      },
      thumbnail: {
        contentUrl: thumbnail.contentUrl,
        height: thumbnail.height,
        width: thumbnail.width
      }
    },
    meta: {
      about: jsonValues.about,
      provider: jsonValues.provider,
      url: jsonValues.url,
      tags: jsonValues.category,
      datePublished: jsonValues.datePublished,
    }
  };
  const storyToInsert = new Story(story);
  return storyToInsert.save();
}

function getItems(filter = {}) {
  return Story.find(filter);
}

function addComments(id, comments = []) {
  return Story.findOne({ _id: id })
  .then(story => {
    const commentSet = new CustomSet();

    commentSet.add(story.comments);
    commentSet.add(comments);
    story.comments = [...commentSet];

    return story.save();
  });
}

function removeComments(id, comments = []) {
  return Story.findOne({ _id: id })
  .then(story => {
    const commentSet = new CustomSet();

    commentSet.add(story.comments);
    commentSet.delete(comments);
    story.comments = [...commentSet];

    return story.save();
  });
}

export default Story;
