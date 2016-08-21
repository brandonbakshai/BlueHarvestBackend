'use strict';

import express from 'express';
import utility from './utility';
import Project from '../models/Project';

const router = express.Router();

router.route('/')
  .get(utility.getAllHelper(Project))
  .post(utility.createHelper(Project));

router.route('/:project_id')
  .get(utility.getHelper(Project))
  .put(utility.updateHelper(Project))
  .delete(utility.deleteHelper(Project));

export default router;
