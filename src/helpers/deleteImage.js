const fs = require('fs');

const deleteImage = (filename) => {
  fs.unlink(`public${filename}`, (err) => {
    if (err) {
      console.log('fs error:', err);
    }
  });
};

module.exports = {deleteImage};
