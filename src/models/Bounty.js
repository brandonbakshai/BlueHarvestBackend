'use strict';

import db from './db.js';
import Post from './Post';
import mongoose from 'mongoose';

const Schema = db.Schema;
const BountySchema = new Schema({
  title: {
    type:     String,
    required: true
  },
  projects: {
    type:     [Schema.ObjectId],
    ref:      'Project',
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

BountySchema.statics.createBounty = createBounty;
BountySchema.statics.getBounty = getBounty;
BountySchema.statics.addProjects = addProjects;
BountySchema.statics.removeProjects = removeProjects;
BountySchema.statics.incrementViews = incrementViews;
BountySchema.statics.updateTags = updateTags;

const Bounty = Post.discriminator('Bounty', BountySchema);

function createBounty(bounty) {
  const bountyToInsert = new Bounty(bounty);
  return bountyToInsert.save();
}

function getBounty(filter = {}) {
  return Bounty.find(filter);
}

function addProjects(id, projects = []) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    const oldProjects = bounty.projects.map(project => project.toString());
    const combinedProjectSet = new Set([...oldProjects, ...projects]);
    console.log(combinedProjectSet);
    const updatedProjects = [];
    combinedProjectSet.forEach(updatedProjects.)
    bounty.projects =  [...updatedProjects];
    return bounty.save();
  });
}

function removeProjects(id, projects = []) {
  let projectSet = new Set(projects.map(x => x.toString()));
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    bounty.projects = [...bounty.projects].filter(x => !projectSet.has(x.toString()));
    return bounty.save();
  });
}

function incrementViews(id) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    const currentViews = bounty.meta.views || 0;
    bounty.meta.views = currentViews + 1;
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

