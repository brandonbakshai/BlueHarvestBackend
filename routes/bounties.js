import express from 'express';
import Bounty from '../models/Bounty';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  Bounty.find()
    .then((result) => { return res.send(result); })
    .catch(err => next(err));
});

router.get('/generate', (req, res, next) => { /* do something here */ });

export default router;
