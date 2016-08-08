'use strict';

const BountyMethods  = require( '../../src/models/Bounty').default.schema.statics;
const Bounty = require( '../../src/models/Bounty').default;
const bountiesSuccess = require('../test-data/bounties').successCases;
const bountiesFailure = require('../test-data/bounties').failureCases;

const expect      = require('chai').expect;
const assert      = require('assert');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfBounties = bountiesSuccess.length;

describe('Bounty', function () {

  // wipe all data
  before(function (done) {
    Bounty.remove({})
    .then(() => {
      console.log('Bounty collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  bountiesSuccess.forEach(bounty => {
    it(`should create and insert ${bounty.title}`, function (done) {
      const meta = bounty.meta || {};
      meta.dateCreated = Date.now();
      bounty.meta = meta;
      return BountyMethods.createBounty(bounty)
      .then(bounty => done())
      .catch(err => done(err));
    });
  });

  it(`getBounty should return ${numberOfBounties}, the number of bounties in bounties.json`, function (done) {
    BountyMethods.getBounty()
    .then(function (result) {
      expect(result.length).to.equal(numberOfBounties);
      done();
    })
    .catch(err => done(err));
  });

  it('getBounty should return no result', function (done) {
    BountyMethods.getBounty({title: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
