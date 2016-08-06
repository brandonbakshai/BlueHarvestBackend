'use strict';

import db from './db.js';
import ModelUtility from './utility';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  authors: [{
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  bounty:[{
    type: Schema.ObjectId,
    ref: 'Bounty'
  }],
  tagline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  media: {
    gitUrl: {
      type: String
    },
    images: [{
      contentUrl: String,
      height: Number,
      width: Number
    }],
    videos: [{
      contentUrl: String,
      height: Number,
      width: Number
    }]
  },
  statistics: {
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

ProjectSchema.statics.createProject = ModelUtility.create();
ProjectSchema.statics.getProject = ModelUtility.get();
ProjectSchema.statics.updateProject = updateProject;
ProjectSchema.statics.deleteProject = ModelUtility.delete();

let Project = db.model('Project', ProjectSchema);

function updateStatistics(id, { upvotes = 0, downvotes = 0}) {
  return this.findOne({ _id: id })
  .then(project => {
    project.statistics.upvotes += upvotes;
    project.statistics.downvotes += downvotes;
    return project.save();
  });
}

function updateMedia(id, { images = {}, videos = {}}) {
  return this.findOne({ _id: id })
  .then(project => {
    project.statistics.upvotes += upvotes;
    project.statistics.downvotes += downvotes;
    return project.save();
  });
}

function updateMeta() {

}

export default Project;
