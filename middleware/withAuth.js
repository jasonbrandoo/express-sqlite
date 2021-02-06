const jwt = require('jsonwebtoken');

const withAuth = (req, res, next) => {
  const header = req.headers;
  const token = header.authorization && header.authorization.split(' ')[1];
  if (token === null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  });
};

module.exports = { withAuth };
