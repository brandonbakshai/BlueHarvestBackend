'use strict';

import express from 'express';
import utility from './utility';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('bounties'))
  .post(utility.createHelper('bounties'));

router.route('/:bounty_id')
  .get(utility.getHelper('bounties'))
  .put(utility.updateHelper('bounties'))
  .delete(utility.deleteHelper('bounties'));

export default router;
