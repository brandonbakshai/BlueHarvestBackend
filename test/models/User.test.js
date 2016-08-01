'use strict';

const UserMethods = require( '../../src/models/User').default.schema.statics;
const User        = require( '../../src/models/User').default;
const expect      = require('chai').expect;
const assert      = require('assert');
const before      = require('mocha').before;
const users       = require('../test-data/users');
const it            = require('mocha').it;

const numberOfUsers = users.length;

before(function () {
  User.remove({})
  .then(result => console.log('User collection wiped'))
  .catch(err => console.log('User collection not wiped successfully'));
})

users.forEach(user => {
  it(`should create and insert ${user.name}`, function (done) {
    UserMethods.createUser(user)
    .then(function (insertedUser) {
      done();
    })
    .catch(function (error) {
      assert.fail(error);
      done();
    });
  });
});

users.forEach(user => {
  it(`verifyPassword should return true after password verification of ${user.name}`, function (done) {
    UserMethods.verifyPassword(user)
    .then(function (result) {
      expect(result).to.equal(true);
      done();
    })
    .catch(function (error) {
      assert.fail(error);
      done();
    });
  });
});

it(`getAllUsers should return ${numberOfUsers}, the number of users in users.json`, function (done) {
  UserMethods.getAllUsersWithFilter()
  .then(function (result) {
    expect(result.length).to.equal(numberOfUsers);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });
});

it('getAllUsers should return no result', function (done) {
  UserMethods.getAllUsersWithFilter({email: 'blah@blah.com'})
  .then(function (result) {
    expect(result.length).to.equal(0);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });
});



