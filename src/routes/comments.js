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
  .delete(utility.deleteHelper(Comment));

router.route('/:bounty_id/upvote')
.put(utility.upvoteHelper(Bounty));

router.route('/:bounty_id/downvote')
.put(utility.downvoteHelper(Bounty));

export default router;
