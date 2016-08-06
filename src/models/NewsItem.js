'use strict';

import db from './db.js';
import requestPromise from 'request-promise';
import ModelUtility from './utility';

const Schema = db.Schema;
const NewsItemSchema = new Schema({
    about: [{
      name: String,
      readLink: String
    }],
    category: String,
    datePublished: String,
    description: String,
    image: {
      thumbnail: {
        contentUrl: String,
        height: Number,
        width: Number
      }
   },
    mentions: [{
      name: String
    }],
    name: String,
    provider: [{
      _type: String,
      name: String
    }],
    url: String,
    social: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 }
    }
});
const NewsItem = db.model('NewsItem', NewsItemSchema);

// CRUD
NewsItemSchema.statics.createNewsItem    = ModelUtility.create(NewsItem);
NewsItemSchema.statics.getNewsItem       = ModelUtility.get(NewsItem);
NewsItemSchema.statics.deleteNewsItem    = ModelUtility.delete(NewsItem);
NewsItemSchema.statics.getFreshNewsItems = getFreshNewsItems;
NewsItemSchema.statics.updateNewsItem    = updateNewsItem;

/**
 * Method returning promise to query bing news search api and insert data as NewsItem in mongodb instance
 * @param res
 * @returns {Promise|Promise.<T>}
 */
function getFreshNewsItems() {
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
    const jsonValues = body.value;
    return NewsItem.collection.insertMany(jsonValues);
  });
}

/**
 * Method to update NewsItem social fields given id
 * @param id unique id representative of a NewsItem
 * @param upvotes number by which to increment the upvotes field
 * @param downvotes number by which to increment the downvotes field
 * @returns {Promise}
 */
function updateNewsItem(id, { upvotes = 0, downvotes = 0 }) {
  return NewsItem.findOne({ _id: id })
  .then(newsItem => {
    newsItem.social.upvotes += upvotes;
    newsItem.social.downvotes += downvotes;
    return newsItem.save();
  });
}

export default NewsItem;
