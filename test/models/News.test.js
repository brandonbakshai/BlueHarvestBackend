'use strict';

const NewsMethods  = require( '../../src/models/News').default.schema.statics;
const News         = require( '../../src/models/News').default;
const newsSuccess = require('../test-data/news').successCases;
const newsFailure = require('../test-data/news').failureCases;

const expect       = require('chai').expect;
const assert       = require('assert');

var describe       = require('mocha').describe;
const before       = require('mocha').before;
const it           = require('mocha').it;

const numberOfSuccesses = newsSuccess.length;

describe('News', function () {
  before(function (done) {
    News.remove({})
    .then(() => {
      console.log('News collection wiped');
      done();
    })
    .catch(err => done(err));
  });

  newsSuccess.forEach(news => {
    it(`should create and insert ${news.title}`, function (done) {
      const meta = news.meta || {};
      meta.dateCreated = Date.now();
      news.meta = meta;
      NewsMethods.createNews(news)
      .then((insertedNews) => {
        done();
      })
      .catch(err => done(err));
    });
  });

  it(`getNews should return ${numberOfSuccesses}, the number of success cases in news.json`, function (done) {
    NewsMethods.getNews()
    .then(function (result) {
      expect(result.length).to.equal(numberOfSuccesses);
      done();
    })
    .catch(err => done(err));
  });

  it('getNews should return no result', function (done) {
    NewsMethods.getNews({title: 'blah'})
    .then(function (result) {
      expect(result.length).to.equal(0);
      done();
    })
    .catch(err => done(err));
  });

  newsFailure.forEach(news => {
    it(`should fail on attempted insertion of ${news.title}`, function (done) {
      NewsMethods.createNews(news)
      .then((insertedNews) => {
        assert.fail("insertion of news succeeded when it should have faile");
        done();
      })
      .catch(err => done());
    });
  });

  it(`getNews should return ${numberOfSuccesses}, the number of success cases in news.json`, function (done) {
    NewsMethods.getNews()
    .then(function (result) {
      expect(result.length).to.equal(numberOfSuccesses);
      done();
    })
    .catch(err => done(err));
  });
});
