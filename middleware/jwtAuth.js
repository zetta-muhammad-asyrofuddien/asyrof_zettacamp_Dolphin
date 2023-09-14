const jwt = require('jsonwebtoken');

const Generate = (req, res) => {
  let jwtSecretKey = 'plered'; //secretkey
  let data = {
    username: 'Asyrofuddien',
    password: 'atopsehat',
  }; //data user

  //data from user input
  let user = req.body.username;
  let pass = req.body.password;
  let token;
  //generate token
  if (data.username === req.body.username && data.password === req.body.password) {
    token = jwt.sign({ user, pass }, jwtSecretKey, { expiresIn: '1h' });
    res.json(token);
  } else {
    res.status(400).json({
      msg: 'Username or Password invalid', //if error
    });
  }
};

module.exports = Generate;
