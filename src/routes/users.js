'use strict';

import express from 'express';
import utility from './utility';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('users'))
  .post(utility.createHelper('users'));

router.route('/:user_id')
  .get(utility.getHelper('users'))
  .put(utility.updateHelper('users'))
  .delete(utility.deleteHelper('users'));

export default router;
