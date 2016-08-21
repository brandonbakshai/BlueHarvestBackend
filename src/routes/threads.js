'use strict';

import express from 'express';
import utility from './utility';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('threads'))
  .post(utility.createHelper('threads'));

router.route('/:thread_id')
  .get(utility.getHelper('threads'))
  .put(utility.updateHelper('threads'))
  .delete(utility.deleteHelper('threads'));

export default router;
