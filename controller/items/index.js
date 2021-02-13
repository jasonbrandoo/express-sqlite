const { Op } = require('sequelize');
const { Item, Type } = require('../../model/items');

const getItems = async (req, res) => {
  try {
    const data = await Item.findAll({
      include: Type,
    });
    return res.status(200).json({
      message: 'success',
      data,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err,
    });
  }
};

const searchItems = async (req, res) => {
  try {
    const { name, type } = req.query;
    const data = await Item.findAll({
      include: [
        {
          model: Type,
          as: 'type',
        },
      ],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.startsWith]: name,
            },
          },
          {
            '$type.name$': {
              [Op.startsWith]: type,
            },
          },
        ],
      },
    });
    if (data.length === 0) {
      return res.status(200).json({
        message: 'success',
        data: 'Data not found',
      });
    }
    return res.status(200).json({
      message: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: 'error',
      data: err,
    });
  }
};

const postItems = async (req, res) => {
  const { name, id_type, price } = req.body;
  try {
    await Item.create({
      name,
      id_type,
      price,
    });
    return res.status(201).json({
      message: 'Success',
      data: 'New item created',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err,
    });
  }
};

const putItems = async (req, res) => {
  const { id } = req.params;
  const { name, id_type, price } = req.body;
  try {
    await Item.update(
      { name, id_type, price },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json({
      message: 'Success',
      data: 'Item updated',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Error',
      data: err,
    });
  }
};

const deleteItems = async (req, res) => {
  const { id } = req.params;
  try {
    await Item.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      message: 'Success',
      data: 'Item deleted',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Error',
      data: err,
    });
  }
};

const getItemsType = async (req, res) => {
  try {
    const data = await Type.findAll();
    return res.status(200).json({
      message: 'success',
      data,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err.errors,
    });
  }
};

const searchItemsType = async (req, res) => {
  try {
    const { name } = req.query;
    const data = await Type.findAll({
      where: {
        name: {
          [Op.startsWith]: name,
        },
      },
    });
    if (data.length === 0) {
      return res.status(200).json({
        message: 'success',
        data: 'Data not found',
      });
    }
    return res.status(200).json({
      message: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: 'error',
      data: err,
    });
  }
};

const postItemsType = async (req, res) => {
  const { name } = req.body;
  try {
    await Type.create({
      name,
    });
    return res.status(200).json({
      message: 'success',
      data: 'New type created',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err.errors,
    });
  }
};

const putItemsType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Type.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json({
      message: 'success',
      data: 'Type updated',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err.errors,
    });
  }
};

const deleteItemsType = async (req, res) => {
  const { id } = req.params;
  try {
    await Type.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      message: 'success',
      data: 'Type deleted',
    });
  } catch (err) {
    return res.status(400).json({
      message: 'error',
      data: err.errors,
    });
  }
};

module.exports = {
  getItems,
  searchItems,
  postItems,
  putItems,
  deleteItems,
  getItemsType,
  searchItemsType,
  postItemsType,
  putItemsType,
  deleteItemsType,
};
