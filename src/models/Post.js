'use strict';

import db from './db.js';

const Schema = db.Schema;
const PostSchema = new Schema({
  authors: {
    type: [Schema.ObjectId],
    ref: 'User',
    required: true,
  },
  body:  {
    type: String,
    required: true
  },
  meta: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  }
},
  {
    timestamps: true
  }
);

// update
PostSchema.statics.upvote = upvote;
PostSchema.statics.downvote = downvote;
PostSchema.statics.updateBody = updateBody;

// delete
PostSchema.statics.deleteItem = deleteItem;

const Post = db.model('Post', PostSchema);

function upvote(id) {
  return Post.findOne({ _id: id })
  .then(post => {
    post.meta.upvotes += 1;
    return post.save();
  });
}

function downvote(id) {
  return Post.findOne({ _id: id })
  .then(post => {
    post.meta.downvotes += 1;
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
function deleteItem(id) {
  return Post.remove({ _id: id });
}

export default Post;

