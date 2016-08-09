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

function getAllUsers(res) {
  User.getUser()
  .then(users => res.send(users))
  .catch(err => errorHandler(err, res));
}

function createUser(req, res) {
  User.createUser(req.body)
  .then(user => res.send(user))
  .catch(err => errorHandler(err, res));
}

function getUser(req, res) {
  User.getUser(req.params.user_id)
  .then(user => res.send(user))
  .catch(err => errorHandler(err, res));
}

function updateUser(req, res) {
  User.updateUser(req.body)
  .then(user => res.send(user))
  .catch(err => errorHandler(err, res));
}

function deleteUser(req, res) {
  User.deleteUser(req.params.user_id)
  .then(() => res.send('success'))
  .catch(err => errorHandler(err, res));
}

export default router;