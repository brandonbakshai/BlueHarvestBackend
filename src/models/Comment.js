'use strict';

import db from './db.js';
import MinorPost from './MinorPost';

//_____________________________________________________________________________________________________________________

// TODO: make a separate Url model and embed that in every model, so in a post at the bottom it will show all the referenced links and pictures of their front pages etc.
const Schema = db.Schema;
const CommentSchema = new Schema({
  parent: {
    type: Schema.ObjectId,
    ref: 'Public',
    required: true
  }
});

//_____________________________________________________________________________________________________________________

// create
CommentSchema.statics.createItem = createComment;

// get
CommentSchema.statics.getItems = getComments;

//_____________________________________________________________________________________________________________________

const Comment = MinorPost.discriminator('Comment', CommentSchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param comment
 * @returns {Promise|*}
 */
function createComment(comment) {
  const commentToInsert = new Comment(comment);
  return commentToInsert.save();
}

/**
 *
 * @param filter
 * @returns {Query|Cursor|*|FindOperatorsUnordered|T|FindOperatorsOrdered}
 */
function getComments(filter = {}) {
  return Comment.find(filter);
}

//_____________________________________________________________________________________________________________________

export default Comment;
