import { Sequelize, DataTypes, Model } from 'sequelize'
import { database } from './database.js'

const Client = database.define('Clients', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
},{})

const Qrcode = database.define('Qrcodes', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
});

const Product = database.define('Products', {
  // Model attributes are defined here
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT
  }
}, {
  // Other model options go here
});

const Menu = database.define('Menus', {
  // Model attributes are defined here
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  currency: {
    type: DataTypes.STRING
  },
  token: {
    type: DataTypes.STRING
  },
  background:{
    type: DataTypes.STRING
  },
  colorTitle:{
    type: DataTypes.STRING
  },
  sizeTitle:{
    type: DataTypes.STRING
  },
  colorItem:{
    type: DataTypes.STRING
  },
  sizeItem:{
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
})

//associations
Client.hasMany(Menu)
Menu.belongsTo(Client)
Menu.hasMany(Product);
Product.belongsTo(Menu);
Menu.hasOne(Qrcode);
Qrcode.belongsTo(Menu)

export {
  Client,
  Qrcode,
  Menu,
  Product
}