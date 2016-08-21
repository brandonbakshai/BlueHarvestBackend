'use strict';

function createHelper(req, res, model) {
  return model.createItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getHelper(req, res, model) {
  return model.getItems({ _id: req.params.bounty_id })
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getAllHelper(req, res, model) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return model.getItems(req.body)
  .then(items => res.send(items))
  .catch(err => res.send(err));
}

function updateHelper(req, res, model) {
  return model.updateItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function deleteHelper(req, res, model) {
  return model.deleteItem(req.params.bounty_id)
  .then(() => res.send('success'))
  .catch(err => res.send(err));
}

function errorHandler(err, res) {
  console.log(`error: ${err}`);
  return res.send(`error: ${err}`);
}

export default {
  createHelper,
  getHelper,
  getAllHelper,
  updateHelper,
  deleteHelper,
  errorHandler
}
