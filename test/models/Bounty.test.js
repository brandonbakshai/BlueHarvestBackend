'use strict';

const Bounty = require( '../../src/models/Bounty').default;
const BountyMethods  = Bounty.schema.statics;

const bountiesSuccess = require('../test-data/bounties').successCases;
const bountiesFailure = require('../test-data/bounties').failureCases;
const numberOfBounties = bountiesSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const CustomSet = require('../../src/util/CustomSet').default;
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;

describe('Bounty', function () {

  // wipe all data
  before(utilityMethods.wipeCollection(Bounty));

  // createItem success case
  bountiesSuccess.forEach(bounty => {
    it(`should create and insert ${bounty.title}`, function (done) {
      bounty.authors = [mongoose.Types.ObjectId()];
      return BountyMethods.createItem(bounty)
      .then(bounty => done())
      .catch(err => done(err));
    });
  });

  // createItem failure case
  bountiesFailure.forEach(bounty => {
    it(`should fail on insert of ${bounty.title}`, function (done) {
      bounty.authors = [mongoose.Types.ObjectId()];
      return BountyMethods.createItem(bounty)
      .then(bounty => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  // getItems
  it(`getBounties should return ${numberOfBounties}, the number of bounties in bounties.json`,
    utilityMethods.getItems(BountyMethods, {}, numberOfBounties, done));

  // addProjects
  it(`addProjects should successfully add one project to the projects field of a bounty`, function (done) {
    const project = mongoose.Types.ObjectId();
    const projectSet = new CustomSet();
    projectSet.add(project);

    // get bounty with title "bounty one"
    BountyMethods.getItems({ title: "bounty one"})
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

  // addProjects
  it(`addProjects should add the same project to the projects field of a bounty with no effect`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getItems({ title: "bounty one"})
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

  // removeProjects
  it(`removeProjects should successfully remove a project from the projects field of a bounty`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getItems({ title: "bounty one"})
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

  // incrementViews
  it(`incrementViews should successfully increase views of bounty by one`, function (done) {
    // get bounty with title "bounty one"
    BountyMethods.getItems({ title: "bounty one"})
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

  // updateData
  it(`updateData should successfully update body, authors, and tags`, function (done) {
    const body = "oi";
    const authors = [mongoose.Types.ObjectId()];
    const tags = ['social justice', 'social networking', 'android'];

    // get bounty with title "bounty one"
    BountyMethods.getItems({ title: "bounty one"})
    .then(bounties => {
      const bounty = bounties[0];
      expect(bounty.meta.tags.length).to.equal(0);
      expect(bounty.body).to.not.equal(body);
      return BountyMethods.updateData(bounty._id, { body, authors, tags });
    })
    .then(bounty => {
      expect(bounty.body).to.equal(body);
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
     return false;
    }
  }

  return true;
}
