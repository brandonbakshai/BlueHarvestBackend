'use strict';

import db from './db.js';
import MajorPost from './MajorPost';
import CustomSet from '../util/CustomSet';

//_____________________________________________________________________________________________________________________

const Schema = db.Schema;
const ThreadSchema = new Schema({
  comments: {
    type: [Schema.ObjectId],
    ref: 'Comment',
  }
});

//_____________________________________________________________________________________________________________________

// create
ThreadSchema.statics.createItem = createItem;

// get
ThreadSchema.statics.getItems = getItems;

// update
ThreadSchema.statics.addComments = addComments;
ThreadSchema.statics.removeComments = removeComments;

//_____________________________________________________________________________________________________________________

const Thread = MajorPost.discriminator('Thread', ThreadSchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param thread
 * @returns {Promise|*}
 */
function createItem(thread) {
  const threadToInsert = new Thread(thread);
  return threadToInsert.save();
}

/**
 *
 * @param filter
 * @returns {Query|Cursor|*|FindOperatorsUnordered|T|FindOperatorsOrdered}
 */
function getItems(filter = {}) {
  return Thread.find(filter);
}

/**
 *
 * @param id
 * @param comments
 * @returns {Promise|Promise.<TResult>}
 */
function addComments(id, comments = []) {
  return Thread.findOne({ _id: id })
  .then(thread => {
    const commentSet = new CustomSet();

    commentSet.add(thread.comments);
    commentSet.add(comments);
    thread.comments = [...commentSet];

    return thread.save();
  });
}

/**
 *
 * @param id
 * @param comments
 * @returns {Promise|Promise.<TResult>}
 */
function removeComments(id, comments = []) {
  return Thread.findOne({ _id: id })
  .then(thread => {
    const commentSet = new CustomSet();

    commentSet.add(thread.comments);
    commentSet.delete(comments);
    thread.comments = [...commentSet];

    return thread.save();
  });
}

//_____________________________________________________________________________________________________________________

export default Thread;
