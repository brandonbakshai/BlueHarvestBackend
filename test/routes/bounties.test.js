'use strict';

const Bounty = require( '../../src/models/Bounty').default;
const bountiesSuccess = require('../test-data/bounties').successCases;
const bountiesFailure = require('../test-data/bounties').failureCases;

const expect = require('chai').expect;
const assert = require('assert');
const mongoose = require('mongoose');
const CustomSet = require('../../src/util/CustomSet').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

const utility = require('../../src/routes/utility').default;

const numberOfBounties = bountiesSuccess.length;

describe('bounties', function () {

  // wipe all data
  before(function (done) {
    Bounty.remove({})
    .then(() => {
      console.log('Bounty collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  const res = { send: () => {} };
  let firstBounty;

  /* route '/' */

  /* post */
  bountiesSuccess.forEach(bounty => {
    it(`should create and insert ${bounty.title}`, function (done) {
      bounty.authors = [mongoose.Types.ObjectId()];
      const req = { body: bounty };
      return utility.createHelper(req, res, Bounty)
      .then(bounty => done())
      .catch(err => done(err));
    });
  });

  /* get */
  it(`should get all ${numberOfBounties} bounties in the collection`, function (done) {
    const req = {};
    return utility.getAllHelper(req, res, Bounty)
    .then((bounties) => {
      expect(bounties.length).to.equal(numberOfBounties);
      firstBounty = bounties[0];
      done()
    })
    .catch(err => done(err));
  });


   /* route '/:bounty_id' */

   /* get */
  it(`should get the single specified bounty from the collection`, function (done) {
    const req = {};
    req.params.bounty_id = firstBounty._id;
    return utility.getHelper(req, res, Bounty)
    .then((bounty) => {
      console.log(bounty);
      done();
    })
    .catch(err => done(err));
  });

   /* put */

   /* delete */
  it(`should delete the single specified bounty from the collection`, function (done) {
    const req = {};
    req.params.bounty_id = firstBounty._id;
    return utility.deleteHelper(req, res, Bounty)
    .then((msg) => {
      console.log(msg);
      done();
    })
    .catch(err => done(err));
  });



});

function checkEquality(one, two) {
  if (one.length !== two.length) return false;

  for (let i = 0; i < one.length; i++) {
    if (one[i] != two[i]) {
      // console.log(one[i] == two[i]);
      // console.log(one[i]);
      // console.log(two[i]);
      return false;
    }
  }

  return true;
}
