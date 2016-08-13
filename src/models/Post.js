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
    type:     String,
    required: true
  },
  meta: {
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
    }
  }
});

PostSchema.statics.updateVotes = updateVotes;
PostSchema.statics.deletePost = deletePost;

const Post = db.model('Post', PostSchema);

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

export default Post;

