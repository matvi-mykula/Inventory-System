const Category = require('../models/category');
const Item = require('../models/item');

const { body, validationResult } = require('express-validator');

const async = require('async');

// exports.item_list = (req, res) => {
//   res.send('item list not implemented');
// };
//
// Display list of all books.
exports.item_list = (req, res) => {
  Item.find({}, 'name description')
    .sort({ title: 1 })
    .populate('description')
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('item_list', {
        title: 'All Item List',
        item_list: list_items,
      });
    });
};

// Display detail page for a specific item.
exports.item_detail = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate('name')
          .populate('category')
          .exec(callback);
      },
      //   book_instance(callback) {
      //     BookInstance.find({ book: req.params.id }).exec(callback);
      //   },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('itemDetail', {
        title: results.item.name,
        item: results.item,
      });
    }
  );
};

exports.item_create_get = (req, res) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('item_form', {
        title: 'Create Item',
        categories: results.categories,
      });
    }
  );
};
// exports.item_create_post = (req, res) => {
//   res.send('item create post not implemented ');
// };

// Handle book create on POST.
exports.item_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('category.*').escape(),
  body('cost', 'Cost must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('inventory', 'Inventory must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      cost: req.body.cost,
      description: req.body.description,
      inventory: req.body.inventory,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const category of results.categories) {
            if (item.category === category._id) {
              category.checked = 'true';
            }
          }
          res.render('item_form', {
            title: 'Create Item',
            categories: results.categories,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(item.url);
    });
  },
];
exports.item_remove_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        res.redirect('/catalog');
      }
      res.render('item_remove', {
        title: 'Delete Item',
        item: results.item,
      });
    }
  );
};
exports.item_remove_post = (req, res, next) => {
  async.parallel(
    console.log(req.bod),
    console.log('req printed'),
    {
      item(callback) {
        Item.findById(req.body.itemid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      //sucess
      if (results.item) {
        res.render('item_remove', {
          title: 'Remove Item',
          item: results.item,
        });
        return;
      }
    },
    Item.findByIdAndRemove(req.body.itemid, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog');
    })
  );
};
