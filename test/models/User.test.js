'use strict';

const User = require( '../../src/models/User').default;
const UserMethods = User.schema.statics;

const usersSuccess = require('../test-data/users').successCases;
const usersFailure = require('../test-data/users').failureCases;
const numberOfUsers = usersSuccess.length;

const expect = require('chai').expect;
const assert = require('assert');
const utilityMethods = require('../../src/test/utility').default;

const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;

describe('User', function () {

  before(utilityMethods.wipeCollection(User));

  usersSuccess.forEach(user => {
    it(`should create and insert ${user.name}`, function (done) {
      UserMethods.createItem(user)
      .then(() => done())
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

  it(`getItems should return ${numberOfUsers}, the number of threads in threads.json`,
    utilityMethods.getItems(UserMethods, {}, numberOfUsers, done));

  it('getItems should return no result',
    utilityMethods.getItems(UserMethods, { email: 'blah@blah.com' }, 0, done));

  usersFailure.forEach(user => {
    it(`should fail on attempted insertion of ${user.name}`, function (done) {
      UserMethods.createItem(user)
      .then(() => {
        assert.fail();
        done();
      })
      .catch(err => done(err));
    });
  });

  it(`getItems should return ${numberOfUsers}, the number of threads in threads.json`,
    utilityMethods.getItems(UserMethods, {}, numberOfUsers, done));
});
