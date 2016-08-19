'use strict';

import db from './db.js';

const Schema = db.Schema;
const PublicSchema = new Schema({
  title: {
    type:     String,
    required: true
  },
  authors: {
    type: [Schema.ObjectId],
    ref: 'User',
    required: true,
  },
  body:  {
    type:     String,
    required: true
  },
  thumbnail: {
    contentUrl:  String,
    height:      Number,
    width:       Number
  },
  media: [
    {
      typeOfMedia: {
        type:     String,
        enum:     ['video', 'image', 'audio'],
        required: true
      },
      contentUrl:  String,
      height:      Number,
      width:       Number
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
    dateCreated: {
      type: Date,
      required: true
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
});

PublicSchema.statics.upvote = upvote;
PublicSchema.statics.downvote = downvote;
PublicSchema.statics.deletePost = deletePost;

const Public = db.model('Public', PublicSchema);

function upvote(id) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.upvotes.$inc();
    return post.save();
  });
}

function downvote(id) {
  return Public.findOne({ _id: id })
  .then(post => {
    post.meta.downvotes.$inc();
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
