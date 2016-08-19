'use strict';

const BountyMethods  = require( '../../src/models/Bounty').default.schema.statics;
const Bounty = require( '../../src/models/Bounty').default;
const bountiesSuccess = require('../test-data/bounties').successCases;
const bountiesFailure = require('../test-data/bounties').failureCases;

const expect = require('chai').expect;
const assert = require('assert');
const mongoose = require('mongoose');
const CustomSet = require('../../src/util/CustomSet').default;

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

  /* createBounty */

  bountiesSuccess.forEach(bounty => {
    it(`should create and insert ${bounty.title}`, function (done) {
      const meta = bounty.meta || {};
      meta.dateCreated = Date.now();
      bounty.meta = meta;
      bounty.authors = [mongoose.Types.ObjectId()];
      return BountyMethods.createBounty(bounty)
      .then(bounty => done())
      .catch(err => done(err));
    });
  });

  bountiesFailure.forEach(bounty => {
    it(`should fail on insert of ${bounty.title}`, function (done) {
      const meta = bounty.meta || {};
      meta.dateCreated = Date.now();
      bounty.meta = meta;
      bounty.authors = [mongoose.Types.ObjectId()];
      return BountyMethods.createBounty(bounty)
      .then(bounty => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  /* getBounty */

  it(`getBounty should return ${numberOfBounties}, the number of bounties in bounties.json`, function (done) {
    BountyMethods.getBounty()
    .then(function (result) {
      expect(result.length).to.equal(numberOfBounties);
      done();
    })
    .catch(err => done(err));
  });

  /* addProjects */

  it(`addProjects should successfully add one project to the projects field of a bounty`, function (done) {
    const project = mongoose.Types.ObjectId();
    const projectSet = new CustomSet();
    projectSet.add(project);

    // get bounty with title "bounty one"
    BountyMethods.getBounty({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.projects.length).to.eql(0);
      return BountyMethods.addProjects(bounty._id, [project]);
    })
    .then(bounty => {
      const existingProjects = new CustomSet();
      existingProjects.add(bounty.projects);
      assert(existingProjects.equals(projectSet));
      done();
    })
    .catch(err => done(err));
  });

  it(`addProjects should add the same project to the projects field of a bounty with no effect`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getBounty({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.projects.length).to.eql(1);
      return BountyMethods.addProjects(bounty._id, bounty.projects);
    })
    .then(bounty => {
      expect(bounty.projects.length).to.eql(1);
      done();
    })
    .catch(err => done(err));
  });

  /* removeProjects */

  it(`removeProjects should successfully remove a project from the projects field of a bounty`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getBounty({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.projects.length).to.equal(1);
      return BountyMethods.removeProjects(bounty._id, bounty.projects);
    })
    .then(bounty => {
      expect(bounty.projects.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });

  /* incrementViews */

  it(`incrementViews should successfully increase viewcount of bounty by one`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getBounty({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.meta.views).to.equal(0);
      return BountyMethods.incrementViews(bounty._id);
    })
    .then(bounty => {
      expect(bounty.meta.views).to.equal(1);
      done();
    })
    .catch(err => done(err));
  });

  /* updateTags */

  it(`updateTags should successfully add an array of string tags to a bounty`, function (done) {
    const tags = ['social justice', 'social networking', 'android'];

    // get bounty with title "bounty one"
    BountyMethods.getBounty({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.meta.tags.length).to.equal(0);
      return BountyMethods.updateTags(bounty._id, tags);
    })
    .then(bounty => {
      console.log(typeof bounty.meta.tags[0]);
      console.log(typeof tags[0]);
      // expect(bounty.meta.tags.map(x => x.toString())).to.eql(tags.map(x => x.toString()));
      assert(checkEquality(bounty.meta.tags, tags));
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
