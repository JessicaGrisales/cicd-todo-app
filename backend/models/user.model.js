import mongoose from 'mongoose'; // Nouveau
const { Schema, model } = mongoose;

const User =new Schema({
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.INTEGER
    },
    location: {
      type: DataTypes.STRING
    }
  });
  return User;

const UserSchema = model('user', User)
export default UserSchema;


/*module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.INTEGER
    },
    location: {
      type: DataTypes.STRING
    }
  });
  return User;
};*/

