'use strict';

import db from './db.js';
import bcrypt from 'bcrypt-as-promised';
import isEmail from 'validator/lib/isEmail';
import uniqueValidator from 'mongoose-unique-validator';
import CustomSet from '../util/CustomSet';

//_____________________________________________________________________________________________________________________

const Schema = db.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: 'An email is required',
    validate: [
      {
        validator: isEmail,
        message: 'Our scientists tell us {VALUE} is not a valid email address'
      }],
    unique: true
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
},
  {
    timestamps: true
  }
);
UserSchema.plugin(uniqueValidator);
const iterations = 10;

//_____________________________________________________________________________________________________________________

// create
UserSchema.statics.createItem = createUser;
UserSchema.statics.verifyPassword = verifyPassword;

// get
UserSchema.statics.getItems = getUsers;

// update
UserSchema.statics.updateItem = updateUser;

UserSchema.statics.addProjectsCreated = addProjectsCreated;
UserSchema.statics.removeProjectsCreated = removeProjectsCreated;
UserSchema.statics.addProjectsContributed = addProjectsContributed;
UserSchema.statics.removeProjectsContributed = removeProjectsContributed;

UserSchema.statics.addBountiesCreated = addBountiesCreated;
UserSchema.statics.removeBountiesCreated = removeBountiesCreated;
UserSchema.statics.addBountiesContributed = addBountiesContributed;
UserSchema.statics.removeBountiesContributed = removeBountiesContributed;

// delete
UserSchema.statics.deleteItem = deleteUser;

//_____________________________________________________________________________________________________________________

const User = db.model('User', UserSchema);

//_____________________________________________________________________________________________________________________

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
function getUsers(filter = {}) {
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
  return User.findOne({ _id: id })
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
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
function addProjectsCreated(id, projects = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const projectSet = new CustomSet();

    projectSet.add(user.projects.created);
    projectSet.add(projects);
    user.projects.created =  [...projectSet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
function removeProjectsCreated(id, projects = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const projectSet = new CustomSet();

    projectSet.add(user.projects.created);
    projectSet.delete(projects);
    user.projects.created = [...projectSet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
function addProjectsContributed(id, projects = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const projectSet = new CustomSet();

    projectSet.add(user.projects.contributed);
    projectSet.add(projects);
    user.projects.contributed =  [...projectSet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
function removeProjectsContributed(id, projects = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const projectSet = new CustomSet();

    projectSet.add(user.projects.contributed);
    projectSet.delete(projects);
    user.projects.contributed = [...projectSet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param bounties
 * @returns {Promise|Promise.<TResult>}
 */
function addBountiesCreated(id, bounties = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const bountySet = new CustomSet();

    bountySet.add(user.bounties.created);
    bountySet.add(bounties);
    user.bounties.created =  [...bountySet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param bounties
 * @returns {Promise|Promise.<TResult>}
 */
function removeBountiesCreated(id, bounties = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const bountySet = new CustomSet();

    bountySet.add(user.bounties.created);
    bountySet.delete(bounties);
    user.bounties.created = [...bountySet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param bounties
 * @returns {Promise|Promise.<TResult>}
 */
function addBountiesContributed(id, bounties = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const bountySet = new CustomSet();

    bountySet.add(user.bounties.contributed);
    bountySet.add(bounties);
    user.bounties.contributed =  [...bountySet];

    return user.save();
  });
}

/**
 *
 * @param id
 * @param bounties
 * @returns {Promise|Promise.<TResult>}
 */
function removeBountiesContributed(id, bounties = []) {
  return User.findOne({ _id: id })
  .then(user => {
    const bountySet = new CustomSet();

    bountySet.add(user.bounties.contributed);
    bountySet.delete(bounties);
    user.bounties.contributed = [...bountySet];

    return user.save();
  });
}

//_____________________________________________________________________________________________________________________

export default User;