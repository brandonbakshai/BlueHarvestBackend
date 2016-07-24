'use strict';

import db from './db.js';
import requestPromise from 'request-promise';

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
    url: String
});
const NewsItem = db.model('NewsItem', NewsItemSchema);

NewsItemSchema.statics.fetchNewsItems = fetchNewsItems;
NewsItemSchema.statics.generateData = generateData;

/**
 * Method returning promise to get NewsItems and serve back to client
 * @param res
 * @returns {Promise|Promise.<T>}
 */
function fetchNewsItems(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return NewsItem.find()
    .then((result) => { return res.send(result); });
}

/**
 * Method returning promise to query bing news search api and insert data as NewsItem in mongodb instance
 * @param res
 * @returns {Promise|Promise.<T>}
 */
function generateData(res) {
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
  })
  .then((insertedValues) => { return res.send(insertedValues); });
}

export default NewsItem;
