'use strict';

function wipeCollection(model, done) {
    return model.remove({})
      .then(() => {
        console.log(`${model.modelName} collection wiped`);
        done();
      })
      .catch(err => done(err));
}

function getItems(modelMethods, filter, expectedLength, done) {
  return modelMethods.getItems()
  .then((result) => {
    expect(result.length).to.equal(expectedLength);
    done();
  })
  .catch(err => done(err));
}

export default {
  wipeCollection,
  getItems
}