'use strict';

const Project = require( '../../src/models/Project').default;
const ProjectMethods = Project.schema.statics;

const projectsSuccess = require('../test-data/projects').successCases;
const projectsFailure = require('../test-data/projects').failureCases;
const numberOfProjects = projectsSuccess.length;

const assert = require('assert');
const mongoose = require('mongoose');
const utilityMethods = require('../../src/test/utility').default;

const before = require('mocha').before;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Project', function () {

  before(utilityMethods.wipeCollection(Project));

  projectsSuccess.forEach(project => {
    it(`should create and insert ${project.title}`, function (done) {
      project.authors = [mongoose.Types.ObjectId()];
      project.bounty = mongoose.Types.ObjectId();
      ProjectMethods.createItem(project)
      .then(project => done())
      .catch(err => done(err));
    });
  });

  projectsFailure.forEach(project => {
    it(`should fail on insert of ${project.title}`, function (done) {
      project.authors = [mongoose.Types.ObjectId()];
      return ProjectMethods.createItem(project)
      .then(() => {
        assert.fail();
        done();
      })
      .catch(err => done());
    });
  });

  it(`getProject should return ${numberOfProjects}, the number of projects in projects.json`,
    utilityMethods.getItems(ProjectMethods, {}, numberOfProjects, done));


  it('getProject should return no result',
    utilityMethods.getItems(ProjectMethods, { name: 'blah' }, 0, done));
});
