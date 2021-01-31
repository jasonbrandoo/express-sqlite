const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const db = require('./db');

const app = express();
const PORT = 3001;
const key = 'SUPER_DUPER_FUCKING_SECRET';

app.use(express.json());

const withAuth = (req, res, next) => {
  const header = req.headers;
  const token = header.authorization && header.authorization.split(' ')[1];
  if (token === null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  });
};

app.post('/register', (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password1,
    password2,
    phone_number,
    address,
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
    bcrypt.hash(password1, salt, (hashErr, hash) => {
      if (hashErr) {
        console.log(hashErr);
        return res.status(400).json({
          message: 'error',
          data: hashErr,
        });
      }
      const query = `
        INSERT INTO
          td_users(firstname, lastname, email, password, phone_number, address)
        VALUES
          (?,?,?,?,?,?);
      `;
      db.run(
        query,
        [firstname, lastname, email, hash, phone_number, address],
        (dbErr) => {
          if (dbErr) {
            console.log(dbErr);
            return res.status(400).json({
              message: 'error',
              data: dbErr,
            });
          }
          return res.status(200).json({
            message: 'success',
            data: 'Resgister success',
          });
        }
      );
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `
    SELECT
      id_user, email, password
    FROM
      td_users
    WHERE
      email = ?
  `;
  db.get(query, [email], (err, row) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: 'error',
        data: err,
      });
    }
    bcrypt.compare(password, row.password, (compareErr, result) => {
      if (compareErr) {
        console.log(compareErr);
        return res.status(400).json({
          message: 'error',
          data: compareErr,
        });
      }
      const token = jwt.sign({ id: row.id_user }, key, { expiresIn: '5m' });
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
  });
});

app.get('/', (req, res) => {
  const sql = `
    SELECT
      td_users.id_user,
      td_users.email,
      td_users.id_user,
      td_tasks.id_task,
      td_tasks.title,
      td_tasks.task
    FROM
      td_users
    LEFT JOIN td_tasks ON td_users.id_user = td_tasks.id_user
    ORDER BY td_tasks.id_task DESC
  `;
  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(400).json({
        message: 'error',
        data: err,
      });
    }
    return res.status(200).json({
      message: 'Express server',
      data: rows,
    });
  });
});

app.post('/create/task', withAuth, (req, res) => {
  const { title, task } = req.body;
  const sql = `
    INSERT INTO
      td_tasks(title, task, id_user)
    VALUES
      (?,?,?);
  `;
  db.run(sql, [title, task, req.user.id], function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: 'error',
        data: err,
      });
    }
    return res.status(200).json({
      message: 'Data created',
    });
  });
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
