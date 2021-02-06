const { User } = require('../../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password1,
    password2,
  } = req.body;

  if (password1 !== password2) {
    return res.status(400).json({
      message: 'error',
      data: 'Password not match',
    });
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: 'error',
        data: err,
      });
    }
    bcrypt.hash(password1, salt, async (hashErr, hash) => {
      if (hashErr) {
        console.log(hashErr);
        return res.status(400).json({
          message: 'error',
          data: hashErr,
        });
      }
      try {
        await User.create({
          firstname,
          lastname,
          username,
          email,
          password: hash,
        });
        return res.status(201).json({
          message: 'Success',
          data: 'Register success',
        });
      } catch (err) {
        const fields = err.fields[0];
        const data = {};
        switch (fields) {
          case 'email':
            data.email = 'Email already exist';
          case 'username':
            data.username = 'Username already exist';
          default:
            data.errors = err.errors[0];
        }
        return res.status(400).json({
          message: 'Error',
          data,
        });
      }
    });
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (username === undefined || password === undefined) {
    return res.status(400).json({
      message: 'error',
      data: 'Username and password cannot be null',
    });
  }
  try {
    const user = await User.findOne({ where: { username } });
    bcrypt.compare(password, user.password, (compareErr) => {
      if (compareErr) {
        console.log(compareErr);
        return res.status(400).json({
          message: 'error',
          data: compareErr,
        });
      }
      const token = jwt.sign({ id: user.id_user }, 'secret', {
        expiresIn: '15m',
      });
      // res.cookie('token', token, {
      //   httpOnly: true,
      //   sameSite: 'none',
      // });
      return res.status(200).json({
        message: 'success',
        data: 'Login success',
        token,
      });
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: 'User not found',
    });
  }
};

module.exports = {
  register,
  login,
};
