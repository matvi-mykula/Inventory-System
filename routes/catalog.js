var express = require('express');
var router = express.Router();

//controller modules
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const otherController = require('../controllers/otherController');

/* GET home page. */

router.get('/', categoryController.index);
//category routes
router.get('/category/create', categoryController.category_create_get);
router.post('/category/create', categoryController.category_create_post);
router.get('/category/remove', categoryController.category_remove_get);
router.post('/category/remove', categoryController.category_remove_post);
//home page

router.get('/catalog', categoryController.index);
router.get('/category/:id', categoryController.see_category);
router.get('/info', otherController.info);
router.get('/contact', otherController.contact);

console.log(3);

//item routes

router.get('/item/create', itemController.item_create_get);
console.log(4);
router.post('/item/create', itemController.item_create_post);
router.get('/item/remove', itemController.item_remove_get);
router.post('/item/remove', itemController.item_remove_post);
router.get('/item/list', itemController.item_list);
router.get('/item/:id', itemController.item_detail);

module.exports = router;
