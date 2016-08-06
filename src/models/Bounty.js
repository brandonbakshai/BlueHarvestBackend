'use strict';

import db from './db.js';

const Schema = db.Schema;
const BountySchema = new Schema({
  dateCreated: {
    type: Date
  },
  authors: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  projects: [{
    type: Schema.ObjectId,
    ref: 'Project'
  }],
  tagline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  statistics: {
    projects: {
      type: Number,
      default: 0
    },
    contributors: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  },
  tags: [String]
});
const Bounty = db.model('Bounty', BountySchema);

/**
 * Method returning promise to insert bounty if it does not already exist or an error if it does
 * @param bounty values
 */
function createNewBounty({
  authors: authors,
  tagline: tagline,
  description: description
}) {
  const bounty = Bounty({ authors, tagline, description });

  return Bounty.findOne(bounty)
  .exec()
  .then((result) => {
    if (result) {
      throw new Error("Bounty already exists");
    } else {
      bounty.dateCreated = new Date();
      return Bounty.collection.insert(bounty)
    }
  });
}

/*
function getNextBountiesAfterCurrent(condition, quantity, selectionFilters) {
  return Bounty.find(selectionFilters)
  .limit(quantity)
  .exec()
  .then((bounties) => res.send(bounties));
}
*/

export default Bounty;
