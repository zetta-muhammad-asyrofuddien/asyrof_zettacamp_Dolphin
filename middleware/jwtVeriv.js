const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = (req, res, next) => {
  const secret = 'plered'; //declare secret key
  try {
    const token = req.headers.authorization; //collect token from headers
    // console.log(token);
    if (!token) {
      return res.status(401).json({ msg: 'Token not Found' }); //if token null/empty
    }
    let userpass;
    //chek the token baerer token or from header
    if (token.split(' ').length === 2) {
      //barear ladkjwahdnlawd
      userpass = token.split(' ')[1];
    } else if (token.split(' ').length === 1) {
      //ladkjwahdnlawd
      userpass = token;
    }

    // console.log(userpass);
    //verify data user
    const verified = jwt.verify(userpass, secret);

    if (verified) {
      console.log(verified); //if passed
      next();
    } else {
      // Access Denied exp,invalid
      return res.status(401).json({
        msg: 'Token Invalid',
      });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
module.exports = jwtAuthMiddleware;
