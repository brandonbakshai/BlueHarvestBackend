'use strict';

const Thread = require( '../../src/models/Thread').default;
const ThreadMethods = Thread.schema.statics;

const threadsSuccess = require('../test-data/threads').successCases;
const threadsFailure = require('../test-data/threads').failureCases;
const numberOfThreads = threadsSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Thread', function () {

  before(utilityMethods.wipeCollection(Thread));

  threadsSuccess.forEach(thread => {
    it(`should create and insert ${thread.title}`, function (done) {
      thread.authors = [mongoose.Types.ObjectId()];
      ThreadMethods.createItem(thread)
      .then(thread => done())
      .catch(err => done(err));
    });
  });

  it(`getItems should return ${numberOfThreads}, the number of threads in threads.json`,
    utilityMethods.getItems(ThreadMethods, {}, numberOfThreads, done));

  it('getItems should return no result',
    utilityMethods.getItems(ThreadMethods, { name: 'blah' }, 0, done));
});
