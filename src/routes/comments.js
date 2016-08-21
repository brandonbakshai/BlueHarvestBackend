'use strict';

import express from 'express';
import Comment from '../models/Comment';
import errorHandler from './utility';

const router = express.Router();

router.route('/')
.get(getAllComments)
.post(createComment);

router.route('/:comment_id')
.get(getComment)
.put(updateComment)
.delete(deleteComment);

function getAllComments(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  Comment.getComment()
  .then(comments => res.send(comments))
  .catch(errorHandler);
}

function createComment(req, res) {
  Comment.createComment(req.body)
  .then(comment => res.send(comment))
  .catch(err => res.send(err));
}

function getComment(req, res) {
  Comment.getComments({ _id: req.params.comment_id })
  .then(comment => res.send(comment))
  .catch(errorHandler);
}

function updateComment(req, res) {
  Comment.updateComment(req.body)
  .then(comment => res.send(comment))
  .catch(errorHandler);
}

function deleteComment(req, res) {
  Comment.deleteComment(req.params.comment_id)
  .then(() => res.send('success'))
  .catch(errorHandler);
}

export default router;
