const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');

const { body, validationResult } = require('express-validator');
const { item_list } = require('./itemController');

exports.info = (req, res) => {
  res.render('info', { title: 'Info Page' });
};

exports.contact = (req, res) => {
  res.render('contact', { title: 'Contact Information' });
};

//import a react element like that doesnt work
// exports.react = (req, res) => {
//   res.render('dynamicStuff');
// };
