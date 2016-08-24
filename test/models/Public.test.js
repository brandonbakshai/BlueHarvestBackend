'use strict';

const ProjectMethods  = require( '../../src/models/Project').default.schema.statics;
const Project         = require( '../../src/models/Project').default;
const publicsSuccess = require('../test-data/publics').successCases;
const publicsFailure = require('../test-data/publics').failureCases;

const expect = require('chai').expect;
const assert = require('assert');

var mongoose = require('mongoose');

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

const numberOfPublics = publicsSuccess.length;

describe('Public', function () {
  before(function (done) {
    Project.remove({})
    .then(() => {
      console.log('Project collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  publicsSuccess.forEach(post => {
    it(`should create and insert ${post.title}`, function (done) {
      post.authors = [mongoose.Types.ObjectId()];
      post.bounty = mongoose.Types.ObjectId();
      ProjectMethods.createItem(post)
      .then(post => done())
      .catch(err => done(err));
    });
  });

  publicsFailure.forEach(post => {
    it(`should fail on insert of ${post.title}`, function (done) {
      post.authors = [mongoose.Types.ObjectId()];
      return ProjectMethods.createItem(post)
      .then(() => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  it(`getProject should return ${numberOfPublics}, the number of publics in publics.json`, function (done) {
    ProjectMethods.getItems()
    .then(function (result) {
      expect(result.length).to.equal(numberOfPublics);
      done();
    })
    .catch(err => done(err));
  });

  it('getProject should return no result', function (done) {
    ProjectMethods.getItems({name: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
