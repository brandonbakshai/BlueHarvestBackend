'use strict';

import express from 'express';
import utility from './utility';
import Thread from '../models/Thread';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(Thread))
  .post(utility.createHelper(Thread));

router.route('/:thread_id')
  .get(utility.getHelper(Thread))
  .put(utility.updateHelper(Thread))
  .delete(utility.deleteHelper(Thread));

export default router;
