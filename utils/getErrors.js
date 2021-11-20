const getErrors = (errs) => errs.array()
.map((err) => {
  return {
    [err.param]: err.msg
  };
})

module.exports = {getErrors}