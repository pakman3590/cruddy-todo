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
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    let todoArray = [];
    files.forEach((file) => {
      let id = file.slice(0, 5);
      let text = id;
      todoArray.push({id, text});
    });
    callback(null, todoArray);
  });
};

exports.readOne = (id, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error ('error reading file'));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  // check if file with id exists
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error(`error updating file id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.rm(filePath, (err) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
