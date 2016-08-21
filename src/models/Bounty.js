'use strict';

import db from './db.js';
import Post from './Post';
import CustomSet from '../util/CustomSet';

const Schema = db.Schema;
const BountySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  projects: {
    type: [Schema.ObjectId],
    ref: 'Project',
    default: []
  },
  meta: {
    views: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  }
});

// create
BountySchema.statics.createItem = createBounty;

// get
BountySchema.statics.getItems = getBounties;

// update
BountySchema.statics.addProjects = addProjects;
BountySchema.statics.removeProjects = removeProjects;
BountySchema.statics.incrementViews = incrementViews;
BountySchema.statics.updateTags = updateTags;

const Bounty = Post.discriminator('Bounty', BountySchema);

function createBounty(bounty) {
  const bountyToInsert = new Bounty(bounty);
  return bountyToInsert.save();
}

function getBounties(filter = {}) {
  return Bounty.find(filter);
}

function addProjects(id, projects = []) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    const projectSet = new CustomSet();

    projectSet.add(bounty.projects);
    projectSet.add(projects);
    bounty.projects =  [...projectSet];

    return bounty.save();
  });
}

function removeProjects(id, projects = []) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    const projectSet = new CustomSet();

    projectSet.add(bounty.projects);
    projectSet.delete(projects);
    bounty.projects = [...projectSet];

    return bounty.save();
  });
}

function incrementViews(id) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    bounty.meta.views += 1;
    return bounty.save();
  });
}

function updateTags(id, tags) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    bounty.meta.tags = tags;
    return bounty.save();
  });
}

export default Bounty;

