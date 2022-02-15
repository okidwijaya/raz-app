const success = (res, status, result) => {
  const data = result.data || null;
  const results = {
    status,
    msg: result.msg,
    data: data,
  };
  return res.status(status).json(results);
};

const error = (res, status, err) => {
  console.log(err);
  const data = err.result.data || null;
  const results = {
    status,
    msg: err.result.msg,
    data: data,
  };
  return res.status(status).json(results);
};

module.exports = {success, error};
