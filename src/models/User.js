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
    unique: true,
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
const iterations = 10;

UserSchema.statics.verifyPassword    = verifyPassword;
UserSchema.statics.getFreshNewsItems = generateData;

UserSchema.statics.createUser = createUser;
UserSchema.statics.getUser = getUser;
UserSchema.statics.updateUser = updateUser;
UserSchema.statics.deleteUser = deleteUser;

const User = db.model('User', UserSchema);

/**
 * Method returning promise to create a new user
 * @param name
 * @param email
 * @param password
 * @returns {Promise}
 */
function createUser({ name, email, password }) {
  let user = { name, email };
  return bcrypt.hash(password, iterations)
  .then((hash) => {
    user.hashedPassword = hash;
    const userToInsert = new User(user);
    return userToInsert.save();
  });
}

/**
 * Returns promise to get user given a filter object
 * @param filter
 * @returns {Query|*|T}
 */
function getUser(filter = {}) {
  return User.find(filter);
}

/**
 * Method to update user fields given unique email
 * @param id unique identifier for user to updatet
 * @param email
 * @param name
 * @returns {Promise}
 */
function updateUser(id, { name, email }) {
  return UserSchema.findOne({ _id: id })
  .then(user => {
    user.name = name || user.name;
    user.email = email || user.email;
    return user.save();
  });
}

/**
 * Returns promise to remove user with given id from collection
 * @param id
 * @returns {Promise}
 */
function deleteUser(id) {
  return User.remove({ _id: id });
}

/**
 * Method returning promise to verify password
 * @param email
 * @param password
 * @returns {Promise}
 */
function verifyPassword({ email, password }) {
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

  return createUser({ name, email, password })
  .then(data => res.send(data));
}

export default User;