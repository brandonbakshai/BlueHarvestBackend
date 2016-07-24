'use strict';

import db from './db.js';
import bcrypt from 'bcrypt-as-promised';
import isEmail from 'validator/lib/isEmail';

const Schema = db.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: isEmail,
      message: 'Our scientists tell us {VALUE} is not a valid email address'
    },
  },
  hashedPassword: { type: String, required: true },
  bounties: {
    created: [{ type: Schema.ObjectId, ref: 'Bounty' }],
    contributed: [{ type: Schema.ObjectId, ref: 'Bounty' }]
  },
  projects: {
    created: [{ type: Schema.ObjectId, ref: 'Project' }],
    contributed: [{ type: Schema.ObjectId, ref: 'Project' }]
  }
});
const User = db.model('User', UserSchema);
const iterations = 10;

UserSchema.statics.verifyPassword = verifyPassword;
UserSchema.statics.getAllUsers = getAllUsers;
UserSchema.statics.generateData = generateData;
UserSchema.statics.createNewUser = createNewUser;

/**
 * Method returning promise to create a new user
 * @param name
 * @param email
 * @param password
 * @returns {Promise|Promise.<TResult>|*}
 */
function createNewUser(name, email, password) {
  let user = { name, email };
  return bcrypt.hash(password, iterations)
    .then((hash) => {
      user.hashedPassword = hash;
      return User.collection.insert(user);
    });
}

/**
 * Method returning promise to verify password
 * @param email
 * @param password
 * @returns {Promise}
 */
function verifyPassword(email, password) {
    return User.findOne({ email }, 'hashedPassword')
      .then(user => bcrypt.compare(password, user.hashedPassword));
}

/**
 * Method returning promise to generate data for development use
 * @param res
 * @returns {Promise|Promise.<T>}
 */
function generateData(res) {
  const name = "Brandon Bakhshai";
  const email = "brandon.bakhshai@gmail.com";
  const password = "password";

  return createNewUser(name, email, password)
  .then((data) => { return res.send(data); });
}

/**
 * Method returning promise to get all users
 * @param res
 * @returns {Promise|Promise.<TResult>}
 */
function getAllUsers(res) {
    return User.find({})
      .exec()
      .then((users) => { return res.send(users); })
}

export default User;