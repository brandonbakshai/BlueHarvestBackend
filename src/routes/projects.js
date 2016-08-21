'use strict';

import express from 'express';
import utility from './utility';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper('projects'))
  .post(utility.createHelper('projects'));

router.route('/:project_id')
  .get(utility.getHelper('projects'))
  .put(utility.updateHelper('projects'))
  .delete(utility.deleteHelper('projects'));

export default router;
