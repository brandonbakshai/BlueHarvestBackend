'use strict';

import db from './db.js';
import Post from './Post';

// TODO: make a separate Url model and embed that in every model, so in a post at the bottom it will show all the referenced links and pictures of their front pages etc.
const Schema = db.Schema;
const CommentSchema = new Schema({
  parent: {
    type:     Schema.ObjectId,
    ref:      'Public',
    required: true
  }
});

CommentSchema.statics.createComment = createComment;
CommentSchema.statics.getComment = getComment;
CommentSchema.statics.updateBody = updateBody;

const Comment = Post.discriminator('Comment', CommentSchema);

function createComment(comment) {
  const commentToInsert = new Comment(comment);
  return commentToInsert.save();
}

function getComment(filter = {}) {
  return Comment.find(filter);
}

function updateBody(id, { body }) {
  return Comment.findOne({ _id: id })
  .then(comment => {
    comment.body = body || comment.body;
    return comment.save();
  });
}

export default Comment;
