const express = require('express');
const {
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
} = require('../controller/items');
const { register, login } = require('../controller/users');
const { withAuth } = require('../middleware/withAuth');
const route = express.Router();

route.post('/register', register);
route.post('/login', login);

route.get('/items', getItems);
route.get('/items/get', searchItems);
route.post('/items', withAuth, postItems);
route.put('/items/:id', withAuth, putItems);
route.delete('/items/:id', withAuth, deleteItems);

route.get('/items/type', getItemsType);
route.get('/items/type/get', searchItemsType);
route.post('/items/type', withAuth, postItemsType);
route.put('/items/type/:id', withAuth, putItemsType);
route.delete('/items/type/:id', withAuth, deleteItemsType);

module.exports = route;
