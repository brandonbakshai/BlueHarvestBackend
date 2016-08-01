'use strict';

import express from 'express';
import User from '../models/User';
import errorHandler from './utility';

const router = express.Router();

router.route('/')
  .get(getAllUsers)
  .post(createUser)

  .get(':user_id', getUser)
  .put(':user_id', updateUser)
  .delete(':user_id', deleteUser);

function getAllUsers(res) {
  User.getAllUsersWithFilter()
  .then(users => res.send(users))
  .catch(errorHandler);
}

function createUser(req, res) {
  User.createUser(req.body)
  .then(user => res.send(user))
  .catch(errorHandler);
}

function getUser(req, res) {
  User.getUser(req.params.user_id)
  .then(user => res.send(user))
  .catch(errorHandler);
}

function updateUser(req, res) {
  User.updateUser(req.body)
  .then(user => res.send(user))
  .catch(errorHandler);
}

function deleteUser(req, res) {
  User.deleteUser(req.params.user_id)
  .then(() => res.send('success'))
  .catch(errorHandler);
}

export default router;