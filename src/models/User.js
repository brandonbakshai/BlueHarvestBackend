'use strict';

import db from './db.js';
import bcrypt from 'bcrypt';
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
const iterations = 8;

UserSchema.statics.verifyPassword = verifyPassword;
UserSchema.statics.getAllUsers = getAllUsers;
UserSchema.statics.generateData = generateData;
UserSchema.statics.createNewUser = createNewUser;

function createNewUser(name, email, password) {
  let user = { name, email };
  return bcrypt.hash(password, iterations)
    .then((hash) => {
      user.hash = hash;
      return User.collection.insert(user);
    });
}

function verifyPassword(email, password) {
    return User.findOne({ email }, 'hashedPassword')
      .then(user => bcrypt.compare(password, user.hashedPassword));
}
  
function generateData(res) {
  const name = "Brandon Bakhshai";
  const email = "brandon.bakhshai@gmail.com";
  const password = "password";

  const user = User({
    name,
    email
  });

  return user.hashAndStorePassword(password)
  .then((data) => { return res.send(data); })
  .catch((err) => { throw new Error(err); });
}

function getAllUsers(res) {
    return User.find({})
      .exec()
      .then((users) => { return res.send(users); })
      .catch((err) => { throw new Error(err); });
}

export default User;