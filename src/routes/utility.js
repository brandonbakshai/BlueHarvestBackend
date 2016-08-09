'use strict';

function errorHandler(err, res) {
  res.send(`error: ${err}`);
  console.log(`error: ${err}`);
}

export default errorHandler;
