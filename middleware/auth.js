require('basic-auth'); //import module basicauth

// Buat middleware autentikasi dasar kustom
function basicAuthMiddleware(Username, Password) {
  return (req, res, next) => {
    // console.log(basicAuth(req));
    const auth = req.headers['authorization']; // collect authorization
    if (!auth) {
      return res.status(401).json({
        msg: 'Auth needed',
      }); //stop here
    }
    const userpass = auth.split(' ')[1]; // split auth to collect the value authorization except "basic"
    const text = Buffer.from(userpass, 'base64').toString('ascii'); //decode data that has been encoded with base64 encoding
    //asyrof:uddien
    const username = text.split(':')[0]; //collect username split with colon
    const password = text.split(':')[1]; //collect password

    // const user = basicAuth(req);
    // console.log(user);
    // if (!user || user.name !== username || user.pass !== password) {
    //   res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    //   return res.status(401).send('Unauthorized');
    // }

    if (!auth || username !== Username || password !== Password) {
      //inform the client that authentication is required to access the requested resource using HTTP Basic authentication
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.status(401).json({
        msg: 'Unauthorized',
      }); //stop here
    }

    next();
  };
}

module.exports = basicAuthMiddleware;
