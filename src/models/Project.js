'use strict';

import db from './db.js';
import Public from './Public';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  bounty: {
    type:     Schema.ObjectId,
    ref:      'Bounty',
    required: true,
  }
});

ProjectSchema.statics.createProject = createProject;
ProjectSchema.statics.getProject = getProject;

const Project = Public.discriminator('Project', ProjectSchema);

function createProject(project) {
  const projectToInsert = new Project(project);
  return projectToInsert.save();
}

function getProject(filter = {}) {
  return Project.find(filter);
}

export default Project;
