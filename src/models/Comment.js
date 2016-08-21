'use strict';

import db from './db.js';
import Post from './Post';

// TODO: make a separate Url model and embed that in every model, so in a post at the bottom it will show all the referenced links and pictures of their front pages etc.
const Schema = db.Schema;
const CommentSchema = new Schema({
  parent: {
    type: Schema.ObjectId,
    ref: 'Public',
    required: true
  }
});

// create
CommentSchema.statics.createComment = createComment;

// get
CommentSchema.statics.getComments = getComments;

const Comment = Post.discriminator('Comment', CommentSchema);

function createComment(comment) {
  const commentToInsert = new Comment(comment);
  return commentToInsert.save();
}

function getComments(filter = {}) {
  return Comment.find(filter);
}

export default Comment;
