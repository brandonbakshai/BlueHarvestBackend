'use strict';

import db from '../models/db';

function createHelper(req, res, collection) {
  const coll = db.connection.collections[collection].collection;

  coll.createItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getHelper(req, res, collection) {
  const coll = db.connection.collections[collection].collection;

  coll.getItems({ _id: req.params.bounty_id })
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getAllHelper(req, res, collection) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const coll = db.connection.collections[collection].collection;
  coll.getItems(req.body)
  .then(items => res.send(items))
  .catch(err => res.send(err));
}

function updateHelper(req, res, collection) {
  const coll = db.connection.collections[collection].collection;

  coll.updateItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function deleteHelper(req, res, collection) {
  const coll = db.connection.collections[collection].collection;

  coll.deleteItem(req.params.bounty_id)
  .then(() => res.send('success'))
  .catch(err => res.send(err));
}

function errorHandler(err, res) {
  res.send(`error: ${err}`);
  console.log(`error: ${err}`);
}

export default {
  createHelper,
  getHelper,
  getAllHelper,
  updateHelper,
  deleteHelper,
  errorHandler
}
