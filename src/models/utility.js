'use strict';

function createGeneral(Model) {
  return (item) => Model.collection.insert(item);
}
function getGeneral(Model) {
  return (filter = {}) => Model.find(filter).exec();
}

function updateGeneral(Model) {
  return (id, item) => find({ _id: id }).


}

function deleteGeneral(Model) {
  return (id) => Model.remove({ _id: id });
}
