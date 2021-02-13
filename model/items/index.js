const { sequelize, DataTypes } = require('../../config/database');

const Item = sequelize.define(
  'item',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_type: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Type',
        key: 'id_type',
      },
      validate: {
        isInt: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
  },
  {
    timestamps: false,
    tableName: 'td_items',
  }
);

const Type = sequelize.define(
  'type',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'td_types',
  }
);

Type.hasMany(Item, {
  foreignKey: 'id_type',
});
Item.belongsTo(Type, {
  foreignKey: 'id_type',
});

module.exports = {
  Item,
  Type,
};
