import express from 'express';

const router = express.Router();

router.route('/')
  .get((req, res) => res.send('responding with a get request'))
  .post((req, res) => res.send('responding to a post request'));

export default router;
