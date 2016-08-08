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

ThreadSchema.statics.createThread = createThread;
ThreadSchema.statics.getThread = getThread;

const Thread = Public.discriminator('Thread', ThreadSchema);

function createThread(project) {
  const projectToInsert = new Thread(project);
  return projectToInsert.save();
}

function getThread(filter = {}) {
  return Thread.find(filter);
}

export default Thread;
