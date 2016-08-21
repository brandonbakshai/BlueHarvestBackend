'use strict';

import express from 'express';
import utility from './utility';
import User from '../models/User';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(User))
  .post(utility.createHelper(User));

router.route('/:user_id')
  .get(utility.getHelper(User))
  .put(utility.updateHelper(User))
  .delete(utility.deleteHelper(User));

export default router;
