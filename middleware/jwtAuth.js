const jwt = require('jsonwebtoken');

const Generate = (req, res) => {
  try {
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

    if (data.username === user && data.password === pass) {
      token = jwt.sign({ user, pass }, jwtSecretKey, { expiresIn: '1h' });
      res.json(token);
    } else {
      res.status(400).json({
        msg: 'Username or Password invalid', //if error
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};

module.exports = Generate;
