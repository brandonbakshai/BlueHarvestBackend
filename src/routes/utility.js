'use strict';

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function createHelper(model, req, res) {
  return model.createItem(req.body)
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<T>|Promise}
 */
function getHelper(model, req, res) {
  return model.getItems({ _id: req.params.bounty_id })
  .then(item => res.send(item))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<T>|Promise}
 */
function getAllHelper(model, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return model.getItems(req.body)
  .then(items => res.send(items))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function deleteHelper(model, req, res) {
  return model.deleteItem(req.params.bounty_id)
  .then(() => res.send('success'))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function updateDataHelper(model, req, res) {
  return model.updateData(req.params.bounty_id, req.body)
  .then(bounty => res.send(bounty))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function upvoteHelper(model, req, res) {
  return model.upvote(req.params.bounty_id)
  .then(bounty => res.send(bounty))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function downvoteHelper(model, req, res) {
  return model.downvote(req.params.bounty_id)
  .then(bounty => res.send(bounty))
  .catch(err => res.send(err));
}

/**
 *
 * @param model
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
function incrementViewsHelper(model, req, res) {
  return model.incrementViews(req.params.bounty_id)
  .then(bounty => res.send(bounty))
  .catch(err => res.send(err));
}

/**
 *
 * @param err
 * @param res
 * @returns {*}
 */
function errorHandler(err, res) {
  console.log(`error: ${err}`);
  return res.send(`error: ${err}`);
}

export default {
  createHelper,
  getHelper,
  getAllHelper,
  updateDataHelper,
  upvoteHelper,
  downvoteHelper,
  incrementViewsHelper,
  deleteHelper,
  errorHandler
}
