// Requiring bcrypt-nodejs for password hashing. 
// Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
//var bcrypt = require("bcrypt-nodejs");

// Creating our User model (for password management)
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {

    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
      isEmail: true,
      len: [1, 50]
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 250]
      }
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Personal"
    }
  });
  return Post;
};

