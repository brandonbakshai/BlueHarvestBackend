'use strict';

import db from './db.js';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  authors: {
    type: [Schema.ObjectId],
    ref: 'User',
    required: true
  },
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

ProjectSchema.statics.createProject = createProject;
ProjectSchema.statics.getProject = getProject;
ProjectSchema.statics.updateStatistics = updateStatistics;
ProjectSchema.statics.deleteProject = deleteProject;

let Project = db.model('Project', ProjectSchema);

function createProject(project) {
  const projectToInsert = new Project(project);
  return projectToInsert.save();
}

function getProject(filter = {}) {
  return Project.find(filter);
}

function updateStatistics(id, { upvotes = 0, downvotes = 0}) {
  return Project.findOne({ _id: id })
  .then(project => {
    project.statistics.upvotes += upvotes;
    project.statistics.downvotes += downvotes;
    return project.save();
  });
}

/**
 * Returns promise to remove project with given id from collection
 * @param id
 * @returns {Promise}
 */
function deleteProject(id) {
  return Project.remove({ _id: id });
}

export default Project;
