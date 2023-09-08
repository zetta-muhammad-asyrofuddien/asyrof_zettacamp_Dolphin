const basicAuth = require('basic-auth');

// Buat middleware autentikasi dasar kustom
function basicAuthMiddleware(username, password) {
  return (req, res, next) => {
    console.log(basicAuth(req));

    const user = basicAuth(req);
    // console.log(user);
    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.status(401).send('Unauthorized');
    }

    next();
  };
}

module.exports = basicAuthMiddleware;
