const { db } = require('../config/firebase');

// @desc    Get all products from Firestore
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ status: 'success', results: products.length, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve products.' });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // req.params.id grabs the ID straight from the URL
    const productId = req.params.id; 
    const docRef = db.collection('products').doc(productId);
    const doc = await docRef.get();

    // If Firebase cannot find the document, return a 404 Not Found
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'This item could not be found in the archives.'
      });
    }

    // Return the single product data
    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve the specific item from the vault.'
    });
  }
};

// @desc    Add a new product to Firestore
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, condition, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ status: 'error', message: 'Name, price, and category are required.' });
    }

    const newProduct = {
      name, description: description || '', price: Number(price), category,
      imageUrl: imageUrl || '', condition: condition || 'Excellent', stock: Number(stock) || 1,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('products').add(newProduct);

    res.status(201).json({ status: 'success', message: 'Product successfully archived.', data: { id: docRef.id, ...newProduct } });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save product.' });
  }
};

// Don't forget to export the new function at the bottom!
module.exports = {
  getAllProducts,
  getProductById,
  createProduct
};