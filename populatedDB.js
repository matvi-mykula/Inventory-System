#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(name, category, cost, sku, description, inventory, cb) {
  itemdetail = {
    name: name,
    category: category,
    cost: cost,
    sku: sku,
    description: description,
    inventory: inventory,
  };
  //   if (d_birth != false) authordetail.date_of_birth = d_birth;
  //   if (d_death != false) authordetail.date_of_death = d_death;

  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  var category = new Category({ title: name, description: description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

//craete categories
function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Category1', 'type one of stuff', callback);
      },
      function (callback) {
        categoryCreate('Category2', 'type two of stuff', callback);
      },
    ],
    cb
  );
}

//create items
function createItems(cb) {
  async.series([
    function (callback) {
      itemCreate(
        'Thing1',
        categories[0],
        5,
        '9780756411336',
        'the first thing',
        2,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Thing2',
        categories[0],
        56,
        '9780756411333',
        'the second thing',
        4,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Thing3',
        categories[0],
        2,
        '9780756411332',
        'the third thing',
        8,
        callback
      );
    },
    function (callback) {
      itemCreate(
        'Thing4',
        categories[1],
        3,
        '9780756411331',
        'the fourth thing',
        2,
        callback
      );
    },
  ]);
}

async.series(
  [createCategories, createItems],
  // Optional callback
  console.log('out of list'),
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log({ results });
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
  console.log('out of callback')
);
