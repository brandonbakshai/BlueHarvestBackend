'use strict';

import express from 'express';
import User from '../models/User';
import errorHandler from './utility';

const router = express.Router();

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:user_id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

function getAllUsers(req, res) {
  User.getUser()
  .then(users => res.send(users))
  .catch(errorHandler);
}

function createUser(req, res) {
  User.createUser(req.body)
  .then(user => res.send(user))
  .catch(err => res.send(err));
}

function getUser(req, res) {
  User.getUser({ _id: req.params.user_id })
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