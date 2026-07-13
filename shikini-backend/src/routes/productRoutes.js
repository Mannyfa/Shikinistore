const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET /api/products
// POST /api/products
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// GET /api/products/:id
// PUT /api/products/:id
// DELETE /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;