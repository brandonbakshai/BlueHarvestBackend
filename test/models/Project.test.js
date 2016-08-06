'use strict';

const ProjectMethods = require( '../../src/models/Project').default.schema.statics;
const Project        = require( '../../src/models/Project').default;
const projects       = require('../test-data/projects');

const UserMethods = require( '../../src/models/User').default.schema.statics;
const User        = require( '../../src/models/User').default;
const usersSuccess      = require('../test-data/users').successCases;

const expect      = require('chai').expect;
const assert      = require('assert');

const before      = require('mocha').before;
const describe       = require('mocha').describe;
const it            = require('mocha').it;

const numberOfProjects = projects.length;

describe('Project', function () {
  before(function (done) {
    Project.remove({})
    .then(() => {
      console.log('Project collection wiped');
      return User.remove({})
    })
    .then(() => {
      console.log('User collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  usersSuccess.forEach(user => {
    it(`should create and insert ${user.title} to be used for project authors`, function (done) {
      UserMethods.createUser(user)
      .then(function (insertedUser) {
        done();
      })
      .catch(err => done(err));
    });
  });

  projects.forEach(project => {
    it(`should create and insert ${project.title}`, function (done) {
      UserMethods.getUser()
      .then(users => {
        const meta = { authors: users, dateCreated: Date.now() };
        project.meta = meta;
        return ProjectMethods.createProject(project)
      })
      .then(function (project) {
        done();
      })
      .catch(err => done(err));
    });
  });

  it(`getProject should return ${numberOfProjects}, the number of projects in projects.json`, function (done) {
    ProjectMethods.getProject()
    .then(function (result) {
      expect(result.length).to.equal(numberOfProjects);
      done();
    })
    .catch(err => done(err));
  });

  it('getProject should return no result', function (done) {
    ProjectMethods.getProject({name: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });
});
