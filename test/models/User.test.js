'use strict';

const UserMethods  = require( '../../src/models/User').default.schema.statics;
const User         = require( '../../src/models/User').default;
const usersSuccess = require('../test-data/users').successCases;
const usersFailure = require('../test-data/users').failureCases;

const expect       = require('chai').expect;
const assert       = require('assert');

var describe       = require('mocha').describe;
const before       = require('mocha').before;
const it           = require('mocha').it;

const numberOfSuccesses = usersSuccess.length;

describe('User', function () {
  before(function (done) {
    User.remove({})
    .then(() => {
      console.log('User collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  usersSuccess.forEach(user => {
    it(`should create and insert ${user.name}`, function (done) {
      UserMethods.createUser(user)
      .then((insertedUser) => {
        done();
      })
      .catch(err => done(err));
    });
  });

  usersSuccess.forEach(user => {
    it(`verifyPassword should return true after password verification of ${user.name}`, function (done) {
      UserMethods.verifyPassword(user)
      .then(function (result) {
        expect(result).to.equal(true);
        done();
      })
      .catch(err => done(err));
    });
  });

  it(`getUser should return ${numberOfSuccesses}, the number of success cases in users.json`, function (done) {
    UserMethods.getUser()
    .then(function (result) {
      expect(result.length).to.equal(numberOfSuccesses);
      done();
    })
    .catch(err => done(err));
  });

  it('getUser should return no result', function (done) {
    UserMethods.getUser({email: 'blah@blah.com'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });

  usersFailure.forEach(user => {
    it(`should fail on attempted insertion of ${user.name}`, function (done) {
      UserMethods.createUser(user)
      .then((insertedUser) => {
        assert.fail(error);
        done();
      })
      .catch(err => done());
    });
  });

  it(`getUser should return ${numberOfSuccesses}, the number of success cases in users.json`, function (done) {
    UserMethods.getUser()
    .then(function (result) {
      expect(result.length).to.equal(numberOfSuccesses);
      done();
    })
    .catch(err => done(err));
  });
});
