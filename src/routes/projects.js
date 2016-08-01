'use strict';

import express from 'express';
import Project from '../models/Project';

const router = express.Router();

router.route('/')
  .get(getAllUsers)
  .post(createUser)

  .get(':project_id', getProject)
  .put(':project_id', updateProject)
  .delete(':project_id', deleteProject);

router.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  Bounty.find()
  .then((result) => { return res.send(result); })
  .catch(err => next(err));
});

router.get('/generate', (req, res, next) => { /* do something here */ });

export default router;
