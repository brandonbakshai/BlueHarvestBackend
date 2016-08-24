'use strict';

import db from './db.js';
import MajorPost from './MajorPost';

//_____________________________________________________________________________________________________________________

const Schema = db.Schema;
const ProjectSchema = new Schema({
  bounty: {
    type: Schema.ObjectId,
    ref: 'Bounty'
  }
});

//_____________________________________________________________________________________________________________________

// create
ProjectSchema.statics.createItem = createProject;

// get
ProjectSchema.statics.getItems = getProjects;

//_____________________________________________________________________________________________________________________

const Project = MajorPost.discriminator('Project', ProjectSchema);

//_____________________________________________________________________________________________________________________

/**
 *
 * @param project
 * @returns {Promise|*}
 */
function createProject(project) {
  const projectToInsert = new Project(project);
  return projectToInsert.save();
}

/**
 *
 * @param filter
 * @returns {Query|Cursor|*|FindOperatorsUnordered|T|FindOperatorsOrdered}
 */
function getProjects(filter = {}) {
  return Project.find(filter);
}

//_____________________________________________________________________________________________________________________

export default Project;
