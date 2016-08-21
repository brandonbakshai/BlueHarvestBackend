'use strict';

import db from './db.js';
import Public from './Public';

const Schema = db.Schema;
const ProjectSchema = new Schema({
  bounty: {
    type: Schema.ObjectId,
    ref: 'Bounty'
  }
});

// create
ProjectSchema.statics.createProject = createProject;

// get
ProjectSchema.statics.getProjects = getProjects;

const Project = Public.discriminator('Project', ProjectSchema);

function createProject(project) {
  const projectToInsert = new Project(project);
  return projectToInsert.save();
}

function getProjects(filter = {}) {
  return Project.find(filter);
}

export default Project;
