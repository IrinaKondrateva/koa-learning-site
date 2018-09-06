const db = require('../models/db');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const validation = require('../libs/adminproduct-valid');

module.exports.getProducts = () => new Promise(async (resolve, reject) => {
  try {
    const products = db.getState().products || [];
    resolve(products);
  } catch (err) {
    reject(err);
  }
});

module.exports.addProduct = ctxreq => new Promise(async (resolve, reject) => {
  try {
    const { name, price } = ctxreq.body;
    const { name: photoName, size, path: photoPath } = ctxreq.files.photo;

    const validError = validation(name, price, photoName, size);

    if (validError) {
      await unlink(photoPath);
      return resolve({success: false, message: validError.message});
    }
    
    const fileName = path.join(process.cwd(), 'public', 'upload', name);
    const errUpload = await rename(photoPath, fileName);

    if (errUpload) {
      return resolve({success: false, message: `При загрузке картинки произошла ошибка!: ${errUpload}`});
    }

    const result = await addProductToDb(name, price, path.join('upload', name));
    if (result.success) {
      resolve(result);
    } else {
      throw new Error('product-adding error');
    }
  } catch (err) {
    reject(err);
  }
});

const addProductToDb = (name, price, photoPath) => new Promise(async (resolve, reject) => {
  try {
    db
      .get('products')
      .push({
        src: photoPath,
        name,
        price
      })
      .write();
    resolve({success: true, message: 'Товар добавлен!'});
  } catch (err) {
    reject(err);
  }
});
