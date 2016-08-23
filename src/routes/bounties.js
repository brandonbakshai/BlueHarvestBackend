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
  .put(Bounty(Bounty))
  .delete(utility.deleteHelper(Bounty));

function updateBody(id, { body }) {

}

export default router;
