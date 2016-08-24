'use strict';

import db from './db.js';
import MinorPost from './MinorPost';
import CustomSet from '../util/CustomSet';

//_____________________________________________________________________________________________________________________

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

//_____________________________________________________________________________________________________________________

// create
BountySchema.statics.createItem = createBounty;

// get
BountySchema.statics.getItems = getBounties;

// update
BountySchema.statics.addProjects = addProjects;
BountySchema.statics.removeProjects = removeProjects;
BountySchema.statics.incrementViews = incrementViews;
BountySchema.statics.updateData = updateData;

//_____________________________________________________________________________________________________________________

const Bounty = MinorPost.discriminator('Bounty', BountySchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param bounty
 * @returns {Promise|*}
 */
function createBounty(bounty) {
  const bountyToInsert = new Bounty(bounty);
  return bountyToInsert.save();
}

/**
 *
 * @param filter
 * @returns {Query|Cursor|*|FindOperatorsUnordered|T|FindOperatorsOrdered}
 */
function getBounties(filter = {}) {
  return Bounty.find(filter);
}

/**
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
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

/**
 *
 * @param id
 * @param projects
 * @returns {Promise|Promise.<TResult>}
 */
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

/**
 *
 * @param id
 * @returns {Promise|Promise.<TResult>}
 */
function incrementViews(id) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    bounty.meta.views += 1;
    return bounty.save();
  });
}

/**
 *
 * @param id
 * @param body
 * @param authors
 * @param tags
 * @returns {Promise|Promise.<TResult>}
 */
function updateData(id, { body, authors, tags }) {
  return Bounty.findOne({ _id: id })
  .then(bounty => {
    bounty.body = body || bounty.body;
    bounty.authors = authors || bounty.authors;
    bounty.meta.tags = tags;
    return bounty.save();
  });
}

//_____________________________________________________________________________________________________________________

export default Bounty;
