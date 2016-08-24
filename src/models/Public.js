'use strict';

import db from './db.js';

const Schema = db.Schema;
const PublicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: {
    type: [Schema.ObjectId],
    ref: 'User',
    required: true,
  },
  body:  {
    type: String,
    required: true
  },
  thumbnail: {
    contentAddress: String,
    height: Number,
    width: Number
  },
  media: [
    {
      typeOfMedia: {
        type: String,
        enum: ['video', 'image', 'audio'],
        required: true
      },
      contentAddress: String,
      height: Number,
      width: Number
    }],
  urls: [{
      description: String,
      address: {
        type: String,
        required: true
      } // get the favicon in the front end and display
  }],
  meta: {
    views: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    tags: [String]
  }
},
  {
    timestamps: true
  }
);

// update
PublicSchema.statics.upvote = upvote;
PublicSchema.statics.downvote = downvote;
PublicSchema.statics.incrementViews = incrementViews;
PublicSchema.statics.updateData = updateData;

// delete
PublicSchema.statics.deleteItem = deletePost;

const Public = db.model('Public', PublicSchema);

function upvote(id) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.upvotes += 1;
    return post.save();
  });
}

function downvote(id) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.downvotes += 1;
    return post.save();
  });
}

function incrementViews(id) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.views =+ 1;
    return post.save();
  });
}

function updateData(id, {
  body,
  authors,
  tags,
  thumbnail,
  media: {
    add,
    remove
  },
  urls: {
    add,
    remove
  }
}) {
  return Public.findOne({ _id: id })
    .then(updateBody(body))
    .then(updateAuthors(authors))
    .then(updateTags(tags))
    .then(updateThumbnail(thumbnail))
    .then(updateMedia(media.add, media.remove))
    .then(updateUrls(urls.add, urls.remove))
    .then(post => post.save())
}

function updateBody(body, post) {
  post.body = body || post.body;
  return post;
}

function updateAuthors(authors, post) {
  post.authors = authors;
  return post;
}

function updateTags(tags, post) {
  post.meta.tags = tags;
  return post;
}

/* update media */

function updateMedia(add, remove, post) {
  const mediaMap = new Map();
  // build original
  post.media.forEach(medium => {
    const value = {
      height: medium.height,
      width: medium.width,
      typeOfMedia: medium.typeOfMedia
    };

    mediaMap.set(medium.contentAddress, value);
  });

  // add - includes update descrips
  add.keys().forEach(contentAddress => mediaMap.set(contentAddress, add.get(contentAddress)));

  // remove
  remove.keys().forEach(contentAddress => mediaMap.delete(contentAddress));

  const mediaSet = new Set();
  mediaMap.forEach((value, key) => {
    value.contentaddress = key;
    mediaSet.add(value);
  });

  // TODO: is the ... necessary?
  post.media = [...mediaSet];
}

/* update urls */

function updateUrls(add, remove, post) {
  const urlDescripMap = new Map();

  // build original
  post.urls.forEach(url => urlDescripMap.set(url.address, url.description));

  // add - includes update descrips
  add.keys().forEach(address => urlDescripMap.set(address, add.get(address)));

  // remove
  remove.keys().forEach(address => urlDescripMap.delete(address));

  const urlSet = new Set();
  urlDescripMap.forEach((value, key) => {
    value.address = key;
    urlSet.add(value);
  });

  // TODO: is the ... necessary?
  post.urls = [...urlSet];

  return post;
}

function updateThumbnail(thumbnail, post) {
  post.thumbnail = post.thumbnail || {};
  post.thumbnail.contentAddress = thumbnail.contentAddress || post.thumbnail.contentAddress;
  post.thumbnail.height = thumbnail.height || post.thumbnail.height;
  post.thumbnail.width = thumbnail.width || post.thumbnail.width;

  return post;
}


/**
 * Returns promise to remove project with given id from collection
 * @param id
 * @returns {Promise}
 */
function deletePost(id) {
  return Public.remove({ _id: id });
}

export default Public;
