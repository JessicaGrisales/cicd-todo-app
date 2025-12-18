/* Ancien code : code de base 
const { DataTypes } = require('sequelize');

const UserModel = require('./user.model');
const TodoModel = require('./todo.model');

function initModels(sequelize) {
  const User = UserModel(sequelize, DataTypes);
  const Todo = TodoModel(sequelize, DataTypes);

  return { User, Todo };
}

module.exports = { initModels };*/

module.exports = { initModels };

const User = require('./user.model');
const Todo = require('./todo.model');

module.exports = {
  User,
  Todo
};