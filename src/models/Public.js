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

PublicSchema.statics.updateBody = updateBody;
PublicSchema.statics.updateTags = updateTags;
PublicSchema.statics.updateAuthors = updateAuthors;
PublicSchema.statics.updateUrls = updateUrls;
PublicSchema.statics.updateMedia = updateMedia;
PublicSchema.statics.updateThumbnail = updateThumbnail;

PublicSchema.statics.incrementViews = incrementViews;

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

function updateBody(id, { body }) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.body = body || post.body;
    return post.save();
  });
}

function updateAuthors(id, authors) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.authors = authors;
    return post.save();
  });
}

function updateTags(id, tags) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.tags = tags;
    return post.save();
  });
}

/* update media */

function updateMedia(id, add, remove) {
  const mediaMap = new Map();
  return Public.findOne({ _id: id })
  .then(post => {
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
  })

}

/* update urls */

function updateUrls(id, add, remove) {
  const urlDescripMap = new Map();
  return Public.findOne({ _id: id })
  .then(post => {
    // build original
    post.urls.forEach(url => urlDescripMap.set(url.address, url.description));

    // add - includes update descrips
    add.keys().forEach(address => urlDescripMap.set(address, add.get(address)));

    // remove
    remove.keys().forEach(address => urlDescripMap.delete(address));
  })
}

function updateThumbnail(id, thumbnail) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.thumbnail = post.thumbnail || {};
    post.thumbnail.contentAddress = thumbnail.contentAddress || post.thumbnail.contentAddress;
    post.thumbnail.height = thumbnail.height || post.thumbnail.height;
    post.thumbnail.width = thumbnail.width || post.thumbnail.width;

    return post.save();
  });
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
