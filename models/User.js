import db from './db.js';
import bcrypt from 'bcryptjs';

const Schema = db.Schema;
const UserSchema = new Schema({
  name: String,
  email: String,
  hashedPassword: String,
  postsCreated: Array,
  postsContributed: Array
});
const User = db.model('User', UserSchema);
// Use this file as a starting point for your project's .eslintrc.
// Copy this file, and add rule overrides as needed.

UserSchema.methods.hashAndStorePassword = hashAndStorePassword;
UserSchema.methods.verifyPassword = verifyPassword;
UserSchema.statics.getAllUsers = getAllUsers;
UserSchema.statics.generateData = generateData;

function hashAndStorePassword(password) {
    return bcrypt.hash(password, 8)
      .then(hash => hash)
      .catch((err) => { throw new Error(err); });
}

function createNewUser(name, email)

function verifyPassword(email, password) {
    return User.findOne({ email }, 'hashedPassword')
      .then(user => bcrypt.compare(password, user.hashedPassword))
      .then(res => res)
      .catch(err => { console.log("Error: ${err}"); return false; });
}
  
function generateData(res) {
    const name = "Brandon Bakhshai";
    const password = "password";

    const user = User({
      name: name,
      hashedPassword: password
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