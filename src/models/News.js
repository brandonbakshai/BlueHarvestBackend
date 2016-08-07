'use strict';

import db from './db.js';
import requestPromise from 'request-promise';
import Post from './Post';

const Schema = db.Schema;
const NewsSchema = new Schema({
  meta: {
    about: [{
      name: String,
      readLink: String
    }],
    provider: [{
      _type: String,
      name: String
    }],
    url: { type: String, required: true }
  }
});

NewsSchema.statics.createNews    = createNews;
NewsSchema.statics.getNews       = getNews;
NewsSchema.statics.deleteNews    = deleteNews;
NewsSchema.statics.getFreshNews  = getFreshNews;
NewsSchema.statics.updateNews    = updateNews;

const News = Post.discriminator('News', NewsSchema);

/**
 * Returns promise to create News backed by argument and insert into the db
 * @param news object containing specification for News instance
 * @returns {Promise|*}
 */
function createNews(news) {
  const newsToInsert = new News(news);
  return newsToInsert.save();
}

/**
 * Method returning promise to query bing news search api and insert all data as News in mongodb instance
 * @returns {Promise|Promise.<T>}
 */
function getFreshNews() {
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
    const promisesArray = body.values.map(value => buildNews(value));
    return Promise.all(promisesArray);
  });
}

/**
 * Helper method given a json representation of a News object which returns a promise to insert that object into the db
 * @param jsonValues json representation of News object
 * @returns {Promise|*} Promise to insert the news object into the db
 */
function buildNews(jsonValues) {
  const image = jsonValues.image || {};
  const thumbnail = image.thumbnail || {};
  const news = {
    title: jsonValues.name,
    content: {
      text:  {
        body: jsonValues.description
      },
      media: [
        {
          typeOfMedia: 'thumbnail',
          contentUrl:  thumbnail.contentUrl,
          height:      thumbnail.height,
          width:       thumbnail.width
        }]
    },
    meta: {
      about: jsonValues.about,
      provider: jsonValues.provider,
      url: jsonValues.url,
      tags: jsonValues.category,
      dateCreated: jsonValues.datePublished,
    }
  };
  const newsToInsert = new News(news);
  return newsToInsert.save();
}

function getNews(filter = {}) {
  return News.find(filter);
}

/**
 * Method to update News social fields given id
 * @param id unique id representative of a News
 * @param upvotes number by which to increment the upvotes field
 * @param downvotes number by which to increment the downvotes field
 * @returns {Promise}
 */
function updateNews(id, { upvotes = 0, downvotes = 0 }) {
  return News.findOne({ _id: id })
  .then(newsItem => {
    newsItem.social.upvotes += upvotes;
    newsItem.social.downvotes += downvotes;
    return newsItem.save();
  });
}

/**
 * Returns promise to remove a News object with given id from collection
 * @param id
 * @returns {Promise}
 */
function deleteNews(id) {
  return News.remove({ _id: id });
}

export default News;
