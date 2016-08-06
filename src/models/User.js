'use strict';

import db from './db.js';
import bcrypt from 'bcrypt-as-promised';
import isEmail from 'validator/lib/isEmail';
import ModelUtility from './utility';

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

// CRUD
UserSchema.statics.createUser = createUser;
UserSchema.statics.getUser = ModelUtility.get();
UserSchema.statics.updateUser = updateUser;
UserSchema.statics.deleteUser = ModelUtility.delete();

const User = db.model('User', UserSchema);

/**
 * Method returning promise to create a new user
 * @param name
 * @param email
 * @param password
 * @returns {Promise|Promise.<TResult>|*}
 */
function createUser({ name, email, password }) {
  let user = { name, email };
  return bcrypt.hash(password, iterations)
  .then((hash) => {
    user.hashedPassword = hash;
    return User.collection.insert(user);
  });
}

/**
 * Method to update user fields given unique email
 * @param email
 * @param name
 * @returns {Promise}
 */
function updateUser(id, { name, email }) {
  return User.findOne({ _id: id })
  .then(user => {
    user.name = name || user.name;
    user.email = email || user.email;
    return user.save();
  });
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