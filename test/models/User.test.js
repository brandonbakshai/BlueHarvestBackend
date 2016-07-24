'use strict';

const UserMethods = require( '../../src/models/User').default.schema.statics;
const User = require( '../../src/models/User').default;
const expect = require('chai').expect;
const assert = require('assert');

it('inserting user return the user inserted', function (done) {
  const name = 'brandon bakhshai';
  const email = 'brandon.bakhshai@gmail.com';
  const password = 'password';

  UserMethods.createNewUser(name, email, password)
  .then(function (insertedUser) {
    console.log(insertedUser);
    done();
  })
  .catch(function (error) {
    assert.fail(error);
    done();
  });

});

it('should return true after password verification', function (done) {
  const email = 'brandon.bakhshai@gmail.com';
  const password = 'password';
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



