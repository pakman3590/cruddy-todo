const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


// (err, newTodo) => {
//   if (err) {
//     res.sendStatus(400);
//   } else {
//     res.status(201).json(newTodo);
//   }
// });

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error receiving counter');
    } else {
      let newFile = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(newFile, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id, text }); // obj is newTodo
          // console.log(`text: ${text}`)
          // console.log(`fileContents: ${fs.readFileSync(newFile).toString()}`)
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
