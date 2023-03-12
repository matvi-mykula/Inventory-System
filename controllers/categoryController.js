const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');

const { body, validationResult } = require('express-validator');
const { item_list } = require('./itemController');

// const async = require('async');
// exports.index = (req, res) => {
//   console.log('home');
//   //   res.send('see home not impleneted');
//   Category.getCats()
//     .then((docs) => {
//       (err, res) => {
//         res.render('index', {
//           title: 'Stuff Store',
//           error: err,
//           data: docs,
//         });
//       };
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// exports.index = (req, res) => {
//   console.log('home');
//   Category.distinct('title').toArray(function (err, result) {
//     if (err) throw err;
//     console.log(result);
//     res.render('index', {
//       title: 'Stuff',
//       data: list_cats,
//     });
//   });
// };

exports.index = (req, res, next) => {
  Category.find({}, 'title description')
    .sort({ title: 1 })
    .exec(function (err, list_cats) {
      console.log({ list_cats });
      if (err) {
        return next(err);
      }
      //Successful, so render
      console.log('working controller');
      res.render('index', { title: 'Category List', cat_list: list_cats });
    });
};

exports.see_category = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }, 'name cost, description').exec(
          callback
        );
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      res.render('category', {
        title: 'Category Items',
        category: results.category,
        item_list: results.category_items,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.send('category create GET not implemented');
};
exports.category_create_post = (req, res) => {
  res.send('category create post not implemented');
};
exports.category_remove_get = (req, res) => {
  res.send('category create GET not implemented');
};
exports.category_remove_post = (req, res) => {
  res.send('category create post not implemented');
};

//delete category
