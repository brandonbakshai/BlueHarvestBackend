'use strict';

function errorHandler(err, res) {
  res.send(`error: ${err}`);
}

export default errorHandler;
