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
  .put(utility.updateHelper(Bounty))
  .delete(utility.deleteHelper(Bounty));

export default router;
