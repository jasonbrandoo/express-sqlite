const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('sql.db', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to database');
  }
});

db.serialize(() => {
  const queryOne = `
    CREATE TABLE IF NOT EXISTS td_users (
      id_user INTEGER PRIMARY KEY,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      phone_number INT NOT NULL,
      address TEXT NOT NULL
    );`;
  db.run(queryOne, (err) => {
    if (err) {
      db.close();
      console.log(`Err => ${err}`);
      console.log('Database closed queryOne error');
      return;
    }
  });
  const queryTwo = `
    CREATE TABLE IF NOT EXISTS td_tasks (
      id_task INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      task TEXT NOT NULL,
      id_user INTEGER NOT NULL,
      FOREIGN KEY (id_user)
        REFERENCES td_users(id_user)
    );`;
  db.run(queryTwo, (err) => {
    if (err) {
      db.close();
      console.log(`Err => ${err}`);
      console.log('Database closed queryTwo error');
      return;
    }
  });
});

module.exports = db;
