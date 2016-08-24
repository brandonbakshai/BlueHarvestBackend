'use strict';

import db from './db.js';

//_____________________________________________________________________________________________________________________

const Schema = db.Schema;
const MinorPostSchema = new Schema({
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

//_____________________________________________________________________________________________________________________

// update
MinorPostSchema.statics.upvote = upvote;
MinorPostSchema.statics.downvote = downvote;
MinorPostSchema.statics.updateData = updateData;

// delete
MinorPostSchema.statics.deleteItem = deleteItem;

//_____________________________________________________________________________________________________________________

const MinorPost = db.model('MinorPost', MinorPostSchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function upvote(id) {
  return MinorPost.findOne({ _id: id })
  .then(minorPost => {
    minorPost.meta.upvotes += 1;
    return minorPost.save();
  });
}

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function downvote(id) {
  return MinorPost.findOne({ _id: id })
  .then(minorPost => {
    minorPost.meta.downvotes += 1;
    return minorPost.save();
  });
}

/**
 *
 * @param id
 * @param body
 * @param authors
 * @returns {Promise|Promise.<TResult>}
 */
function updateData(id, { body, authors }) {
  return MinorPost.findOne({ _id: id })
  .then(minorPost => {
    minorPost.body = body || minorPost.body;
    minorPost.authors = authors || minorPost.authors;
    return minorPost.save();
  });
}

/**
 *
 * @param id
 * @returns {Promise}
 */
function deleteItem(id) {
  return MinorPost.remove({ _id: id });
}

//_____________________________________________________________________________________________________________________

export default MinorPost;

