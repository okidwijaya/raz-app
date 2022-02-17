const multer = require('multer');
const path = require('path');

const maxfilesize = 2 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/products/');
  },
  filename: (req, file, cb) => {
    const fileName = `raz-product-img-${Date.now()}${path.extname(
      file.originalname,
    )}`;
    cb(null, fileName);
  },
});

const multerOption = {
  storage,
  fileFilter: (req, file, cb) => {
    req.isPassFilter = true;
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!');
      err.code = 'WRONG_EXSTENSION';
      return cb(err);
    }
  },
  limits: {fileSize: maxfilesize},
};

const getImagePath = (files) => {
  const imagePath = [];
  files.forEach((element) => {
    const path = `/products/${element.filename}`;
    imagePath.push(path);
  });
  return imagePath;
};

const upload = multer(multerOption).array('images', 3);
const multerHandler = (req, res, next) => {
  console.log('inside multer');
  upload(req, res, (err) => {
    if (err) {
      console.log('error found', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 400,
          err: {msg: `Image size mustn't be bigger than 2MB!`, data: null},
        });
      }
      if (err.code === 'WRONG_EXSTENSION') {
        return res.status(400).json({
          status: 400,
          err: {msg: `Only .png, .jpg and .jpeg format allowed!`, data: null},
        });
      }
      return res.status(500).json({
        status: 500,
        err: {msg: `Something went wrong`, data: null},
      });
    }
    const images = getImagePath(req.files);
    req.images = images;
    next();
  });
};

module.exports = multerHandler;
