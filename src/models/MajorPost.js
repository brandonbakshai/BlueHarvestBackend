'use strict';

import db from './db.js';

//_____________________________________________________________________________________________________________________

const Schema = db.Schema;
const MajorPostSchema = new Schema({
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

//_____________________________________________________________________________________________________________________

// update
MajorPostSchema.statics.upvote = upvote;
MajorPostSchema.statics.downvote = downvote;
MajorPostSchema.statics.incrementViews = incrementViews;
MajorPostSchema.statics.updateData = updateData;

// delete
MajorPostSchema.statics.deleteItem = deletePost;

//_____________________________________________________________________________________________________________________

const MajorPost = db.model('MajorPost', MajorPostSchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param id
 * @param body
 * @param authors
 * @param tags
 * @param thumbnail
 * @param mediaAdd
 * @param mediaRemove
 * @param urlsAdd
 * @param urlsRemove
 * @returns {Promise.<TResult>}
 */
function updateData(id, {
  body,
  authors,
  tags,
  thumbnail,
  mediaAdd,
  mediaRemove,
  urlsAdd,
  urlsRemove
}) {
  return MajorPost.findOne({ _id: id })
  .then(majorPost => updateBody(body, majorPost))
  .then(majorPost => updateAuthors(authors, majorPost))
  .then(majorPost => updateTags(tags, majorPost))
  .then(majorPost => updateThumbnail(thumbnail, majorPost))
  .then(majorPost => updateMedia(mediaAdd, mediaRemove, majorPost))
  .then(majorPost => updateUrls(urlsAdd, urlsRemove, majorPost))
  .then(majorPost => majorPost.save())
}

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function upvote(id) {
  return MajorPost.findOne({ _id: id })
  .then(majorPost => {
    majorPost.meta.upvotes += 1;
    return majorPost.save();
  });
}

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function downvote(id) {
  return MajorPost.findOne({ _id: id })
  .then(majorPost => {
    majorPost.meta.downvotes += 1;
    return majorPost.save();
  });
}

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function incrementViews(id) {
  return MajorPost.findOne({ _id: id })
  .then(majorPost => {
    majorPost.meta.views =+ 1;
    return majorPost.save();
  });
}

/**
 *
 * @param body
 * @param majorPost
 * @returns {*}
 */
function updateBody(body, majorPost) {
  if (!body) return majorPost;

  majorPost.body = body || majorPost.body;
  return majorPost;
}

/**
 *
 * @param authors
 * @param majorPost
 * @returns {*}
 */
function updateAuthors(authors, majorPost) {
  if (!authors) return majorPost;

  majorPost.authors = authors || majorPost.authors;
  return majorPost;
}

/**
 *
 * @param tags
 * @param majorPost
 * @returns {*}
 */
function updateTags(tags, majorPost) {
  if (!tags) return majorPost;

  majorPost.meta.tags = tags || majorPost.meta.tags;
  return majorPost;
}

/**
 *
 * @param add
 * @param remove
 * @param majorPost
 * @returns {*}
 */
function updateMedia(add, remove, majorPost) {
  if (!add || !remove) return majorPost;

  const mediaMap = new Map();
  // build original
  majorPost.media.forEach(medium => {
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
  majorPost.media = [...mediaSet];

  return majorPost;
}

/**
 *
 * @param add
 * @param remove
 * @param majorPost
 * @returns {*}
 */
function updateUrls(add, remove, majorPost) {
  if (!add || !remove) return majorPost;

  const urlDescripMap = new Map();

  // build original
  majorPost.urls.forEach(url => urlDescripMap.set(url.address, url.description));

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
  majorPost.urls = [...urlSet];

  return majorPost;
}

/**
 *
 * @param thumbnail
 * @param majorPost
 * @returns {*}
 */
function updateThumbnail(thumbnail, majorPost) {
  if (!thumbnail) return majorPost;

  majorPost.thumbnail = majorPost.thumbnail || {};
  majorPost.thumbnail.contentAddress = thumbnail.contentAddress || majorPost.thumbnail.contentAddress;
  majorPost.thumbnail.height = thumbnail.height || majorPost.thumbnail.height;
  majorPost.thumbnail.width = thumbnail.width || majorPost.thumbnail.width;

  return majorPost;
}

/**
 *
 * @param id
 * @returns {Promise}
 */
function deletePost(id) {
  return MajorPost.remove({ _id: id });
}

//_____________________________________________________________________________________________________________________

export default MajorPost;
