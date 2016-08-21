'use strict';

import express from 'express';
import utility from './utility';
import Story from '../models/Story';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(Story))
  .post(utility.createHelper(Story));

router.route('/:story_id')
  .get(utility.getHelper(Story))
  .put(utility.updateHelper(Story))
  .delete(utility.deleteHelper(Story));

router.get('/live', getFreshStories);

function getFreshStories(req, res) {
  Story.getFreshStories(req, res)
  .then(insertedValues => res.send(insertedValues))
  .catch(utility.errorHandler);
}

export default router;
