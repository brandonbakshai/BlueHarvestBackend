'use strict';

import db from './db.js';
import Post from './Post';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  media: {
    gitUrl: {
      type: String
    }
  },
  meta: {
    authors: {
      type: [Schema.ObjectId],
      ref: 'User',
      required: true, // TODO add length validation
    },
    bounty:[{
      type: Schema.ObjectId,
      ref: 'Bounty'
    }]
  },
});

ProjectSchema.statics.createProject = createProject;
ProjectSchema.statics.getProject = getProject;
ProjectSchema.statics.updateVotes = updateVotes;
ProjectSchema.statics.deleteProject = deleteProject;

const Project = Post.discriminator('Project', ProjectSchema);

function createProject(project) {
  const projectToInsert = new Project(project);
  return projectToInsert.save();
}

function getProject(filter = {}) {
  return Project.find(filter);
}

function updateVotes(id, { upvotes = 0, downvotes = 0}) {
  return Project.findOne({ _id: id })
  .then(project => {
    project.meta.upvotes += upvotes;
    project.meta.downvotes += downvotes;
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
