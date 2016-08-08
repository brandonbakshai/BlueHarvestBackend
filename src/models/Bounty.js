'use strict';

import db from './db.js';

const Schema = db.Schema;
const BountySchema = new Schema({
  title: {
    type:     String,
    required: true
  },
  projects: {
    type:     [Schema.ObjectId],
    ref:      'Project',
  },
  meta: {
    views: {
      type: Number,
      default: 0
    },
    tags: [String]
  }
});

BountySchema.statics.createBounty = createBounty;
BountySchema.statics.getBounty = getBounty;
BountySchema.statics.addProjects = addProjects;

let Bounty = db.model('Bounty', BountySchema);

function createBounty(bounty) {
  const bountyToInsert = new Bounty(bounty);
  return bountyToInsert.save();
}

function getBounty(filter = {}) {
  return Bounty.find(filter);
}

function addProjects(id, projects = []) {
  const updatedProjectSet = new Set(projects);
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    const oldProjectSet = new Set(bounty.projects);
    bounty.projects = new Set([oldProjectSet, updatedProjectSet]) || bounty.projects;
    return bounty.save();
  });
}

export default Bounty;

