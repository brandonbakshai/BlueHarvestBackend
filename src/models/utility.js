'use strict';

function createGeneral() {
  return (item) => this.collection.insert(item);
}
function getGeneral() {
  return (filter = {}) => this.find(filter).exec();
}

function deleteGeneral() {
  return (id) => this.remove({ _id: id });
}

const ModelFunctions = {
  create: createGeneral,
  get: getGeneral,
  delete: deleteGeneral
}

export default ModelFunctions;
