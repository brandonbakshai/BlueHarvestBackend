'use strict';

import db from './db.js';

const Schema = db.Schema;
const ForumPostSchema = new Schema({
  url: {
    type: String
  },
  statistics: {
    comments: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
  },
});

ForumPostSchema.statics.createForumPost = createForumPost;
ForumPostSchema.statics.getForumPost = getForumPost;
ForumPostSchema.statics.updateStatistics = updateStatistics;
ForumPostSchema.statics.deleteForumPost = deleteForumPost;

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
