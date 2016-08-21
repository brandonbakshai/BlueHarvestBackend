'use strict';

import db from './db.js';
import Public from './Public';

const Schema = db.Schema;
const ThreadSchema = new Schema({
  comments: {
    type: [Schema.ObjectId],
    ref: 'Comment',
  }
});

// create
ThreadSchema.statics.createThread = createThread;

// get
ThreadSchema.statics.getThreads = getThreads;

const Thread = Public.discriminator('Thread', ThreadSchema);

function createThread(thread) {
  const threadToInsert = new Thread(thread);
  return threadToInsert.save();
}

function getThreads(filter = {}) {
  return Thread.find(filter);
}

export default Thread;
