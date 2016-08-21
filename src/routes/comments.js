'use strict';

import express from 'express';
import utility from './utility';


const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('comments'))
  .post(utility.createHelper('comments'));

router.route('/:comment_id')
  .get(utility.getHelper('comments'))
  .put(utility.updateHelper('comments'))
  .delete(utility.deleteHelper('comments'));

export default router;
