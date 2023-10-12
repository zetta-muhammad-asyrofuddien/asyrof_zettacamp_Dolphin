const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');

const Generate = async (req, res) => {
  try {
    let jwtSecretKey = 'plered'; //secretkey
    //data from user input
    let user = req.body.username;
    let pass = req.body.password;
    const userId = await User.find({ username: user });

    const result = await bcrypt.compare(pass, userId[0].password);

    let token;
    //generate token
    if (userId && userId[0].username === user && result) {
      // console.log(userId[0].username);
      token = jwt.sign({ userId: userId[0]._id, username: userId[0].username }, jwtSecretKey, { expiresIn: '6h' });

      res.json({ userId: userId[0]._id, msg: 'Login Success', token: token });
    } else {
      throw new Error('Username or Password invalid');
    }
    // if (data.username === user && data.password === pass) {
    //   token = jwt.sign({ user, pass }, jwtSecretKey, { expiresIn: '4h' });
    //   res.json(token);
    // } else {
    //   res.status(400).json({
    //     msg: 'Username or Password invalid', //if error
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};

module.exports = Generate;
