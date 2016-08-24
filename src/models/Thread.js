'use strict';

import db from './db.js';
import Public from './Public';
import CustomSet from '../util/CustomSet';

const Schema = db.Schema;
const ThreadSchema = new Schema({
  comments: {
    type: [Schema.ObjectId],
    ref: 'Comment',
  }
});

// create
ThreadSchema.statics.createItem = createItem;

// get
ThreadSchema.statics.getItems = getItems;

// update
ThreadSchema.statics.addComments = addComments;
ThreadSchema.statics.removeComments = removeComments;

const Thread = Public.discriminator('Thread', ThreadSchema);

function createItem(thread) {
  const threadToInsert = new Thread(thread);
  return threadToInsert.save();
}

function getItems(filter = {}) {
  return Thread.find(filter);
}

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

export default Thread;
