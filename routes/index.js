var express = require('express');
var router = express.Router();

//controller modules
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/catalog');
  // res.render('index', { title: 'Stuff Store' });
});

module.exports = router;
