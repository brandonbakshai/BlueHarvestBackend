'use strict';

const UserMethods = require( '../../src/models/User').default.schema.statics;
const User        = require( '../../src/models/User').default;
const expect      = require('chai').expect;
const assert      = require('assert');
const before      = require('mocha').before;

const email = 'brandon.bakhshai@gmail.com';
const password = 'password';

before(function () {
  User.remove({})
  .then(result => console.log('User collection wiped'))
  .catch(err => console.log('User collection not wiped successfully'));
})

it('createUser should return the user inserted', function (done) {
  const name = 'brandon bakhshai';

  UserMethods.createUser(name, email, password)
  .then(function (insertedUser) {
    console.log(insertedUser);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });

});

it('verifyPassword should return true after password verification', function (done) {
  UserMethods.verifyPassword(email, password)
  .then(function (result) {
    expect(result).to.equal(true);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });
});

it('getAllUsers should return Brandon Bakhshai only', function (done) {
  UserMethods.getAllUsersWithFilter()
  .then(function (result) {
    console.log(result);
    expect(result.length).to.equal(1);
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
    console.log(result);
    expect(result.length).to.equal(0);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });
});



