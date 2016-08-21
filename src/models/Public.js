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
    contentUrl: String,
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
      contentUrl: String,
      height: Number,
      width: Number
    }],
  urls: [{
      description: String,
      url: {
        type: String,
        required: true
      }
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
  return Post.findOne({ _id: id })
  .then(post => {
    post.body = body || post.body;
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
