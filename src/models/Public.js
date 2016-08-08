'use strict';

import db from './db.js';

const Schema = db.Schema;
const PublicSchema = new Schema({
  title: {
    type:     String,
    required: true
  },
  author: {
    type: Schema.ObjectId,
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
        enum:     ['video', 'image', 'audio', 'urls'],
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

PublicSchema.statics.updateVotes = updateVotes;
PublicSchema.statics.deletePost = deletePost;

const Public = db.model('Public', PublicSchema);

function updateVotes(id, { upvotes = 0, downvotes = 0}) {
  return Post.findOne({ _id: id })
  .then(post => {
    post.meta.upvotes += upvotes;
    post.meta.downvotes += downvotes;
    return post.save();
  });
}

/**
 * Returns promise to remove project with given id from collection
 * @param id
 * @returns {Promise}
 */
function deletePost(id) {
  return Post.remove({ _id: id });
}

export default Public;
