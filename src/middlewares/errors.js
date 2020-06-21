/* eslint-disable no-unused-vars */
const catchErrors = (err, req, res, next) => {
  res.status(err.status || 500).send({
    error: err.message,
  });
};

module.exports = {
  catchErrors,
};
