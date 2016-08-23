'use strict';

function createHelper(model, req, res) {
  return model.createItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getHelper(model, req, res) {
  return model.getItems({ _id: req.params.bounty_id })
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function getAllHelper(model, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return model.getItems(req.body)
  .then(items => res.send(items))
  .catch(err => res.send(err));
}

function updateHelper(model, req, res) {
  return model.updateItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

function deleteHelper(model, req, res) {
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
