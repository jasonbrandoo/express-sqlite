const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './index.db',
});

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.log(`Unable to connect to the database ${err}`);
  }
};

module.exports = {
  initDb,
  sequelize,
  DataTypes,
};
