'use strict';

import express from 'express';
import Story from '../models/Story';
import utility from './utility';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('stories'))
  .post(utility.createHelper('stories'));

router.route('/:story_id')
  .get(utility.getHelper('stories'))
  .put(utility.updateHelper('stories'))
  .delete(utility.deleteHelper('stories'));

router.get('/live', getFreshStories);

function getFreshStories(req, res) {
  Story.getFreshStories(req, res)
  .then(insertedValues => res.send(insertedValues))
  .catch(utility.errorHandler);
}

export default router;
