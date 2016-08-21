'use strict';

import express from 'express';
import Bounty from '../models/Bounty';
import errorHandler from './utility';

const router = express.Router();

router.route('/')
  .get(getAllBounties)
  .post(createBounty);

router.route('/:bounty_id')
  .get(getBounty)
  .put(updateBounty)
  .delete(deleteBounty);

function getAllBounties(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  Bounty.getBounty()
  .then(bounties => res.send(bounties))
  .catch(errorHandler);
}

function createBounty(req, res) {
  Bounty.createBounty(req.body)
  .then(bounty => res.send(bounty))
  .catch(err => res.send(err));
}

function getBounty(req, res) {
  Bounty.getBounties({ _id: req.params.bounty_id })
  .then(bounty => res.send(bounty))
  .catch(errorHandler);
}

function updateBounty(req, res) {
  Bounty.updateBounty(req.body)
  .then(bounty => res.send(bounty))
  .catch(errorHandler);
}

function deleteBounty(req, res) {
  Bounty.deleteBounty(req.params.bounty_id)
  .then(() => res.send('success'))
  .catch(errorHandler);
}

export default router;
