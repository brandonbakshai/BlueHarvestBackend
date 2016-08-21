'use strict';

const ProjectMethods  = require( '../../src/models/Project').default.schema.statics;
const Project         = require( '../../src/models/Project').default;
const projectsSuccess = require('../test-data/projects').successCases;
const projectsFailure = require('../test-data/projects').failureCases;

const expect = require('chai').expect;
const assert = require('assert');

var mongoose = require('mongoose');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfProjects = projectsSuccess.length;

describe('Project', function () {
  before(function (done) {
    Project.remove({})
    .then(() => {
      console.log('Project collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  projectsSuccess.forEach(project => {
    it(`should create and insert ${project.title}`, function (done) {
      const meta = project.meta || {};
      meta.dateCreated = Date.now();
      project.meta = meta;
      project.authors = [mongoose.Types.ObjectId()];
      project.bounty = mongoose.Types.ObjectId();
      ProjectMethods.createItem(project)
      .then(project => done())
      .catch(err => done(err));
    });
  });

  it(`getProject should return ${numberOfProjects}, the number of projects in projects.json`, function (done) {
    ProjectMethods.getItems()
    .then(function (result) {
      expect(result.length).to.equal(numberOfProjects);
      done();
    })
    .catch(err => done(err));
  });

  it('getProject should return no result', function (done) {
    ProjectMethods.getItems({name: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
