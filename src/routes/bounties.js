'use strict';

import express from 'express';
import utility from './utility';
import Bounty from '../models/Bounty';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(Bounty))
  .post(utility.createHelper(Bounty));

router.route('/:bounty_id')
  .get(utility.getHelper(Bounty))
  .put(utility.updateDataHelper(Bounty))
  .delete(utility.deleteHelper(Bounty));

router.route('/:bounty_id/upvote')
  .put(utility.upvoteHelper(Bounty));

router.route('/:bounty_id/downvote')
  .put(utility.downvoteHelper(Bounty));

router.route('/:bounty_id/view')
.put(utility.incrementViewsHelper(Bounty));

export default router;
