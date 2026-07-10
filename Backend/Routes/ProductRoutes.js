const {CreateProduct, GetAllProducts, UpdateProduct,GetAllProductsById,DeleteProduct} = require('../Controller/ProductController');
const express = require('express');
const router = express.Router();
const upload = require('../MiddleWare/UploadMiddleWare');

router.post('/create', upload.single('image'), CreateProduct);
router.get('/all', GetAllProducts);
router.get('/:id', GetAllProductsById);
router.put('/:id', upload.single('image'), UpdateProduct);
router.delete('/:id', DeleteProduct);

module.exports = router;