'use strict';

import express from 'express';
import utility from './utility';
import Comment from '../models/Comment';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(Comment))
  .post(utility.createHelper(Comment));

router.route('/:comment_id')
  .get(utility.getHelper(Comment))
  .put(utility.updateHelper(Comment))
  .delete(utility.deleteHelper(Comment));

export default router;
