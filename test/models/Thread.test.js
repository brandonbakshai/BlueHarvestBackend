'use strict';

const ThreadMethods  = require( '../../src/models/Thread').default.schema.statics;
const Thread         = require( '../../src/models/Thread').default;
const threadsSuccess = require('../test-data/threads').successCases;
const threadsFailure = require('../test-data/threads').failureCases;

const expect = require('chai').expect;
const assert = require('assert');

var mongoose = require('mongoose');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfThreads = threadsSuccess.length;

describe('Thread', function () {
  before(function (done) {
    Thread.remove({})
    .then(() => {
      console.log('Thread collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  threadsSuccess.forEach(thread => {
    it(`should create and insert ${thread.title}`, function (done) {
      const meta = thread.meta || {};
      meta.dateCreated = Date.now();
      thread.meta = meta;
      thread.author = mongoose.Types.ObjectId();
      ThreadMethods.createThread(thread)
      .then(thread => done())
      .catch(err => done(err));
    });
  });

  it(`getThread should return ${numberOfThreads}, the number of threads in threads.json`, function (done) {
    ThreadMethods.getThread()
    .then(function (result) {
      expect(result.length).to.equal(numberOfThreads);
      done();
    })
    .catch(err => done(err));
  });

  it('getThread should return no result', function (done) {
    ThreadMethods.getThread({name: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
