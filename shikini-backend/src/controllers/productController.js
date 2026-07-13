const { db } = require('../config/firebase');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products from the archives.'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const docRef = db.collection('products').doc(productId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Piece not found in the archives.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: docSnap.id,
        ...docSnap.data()
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch the specific piece.'
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newDocRef = await db.collection('products').add(productData);

    res.status(201).json({
      status: 'success',
      data: {
        id: newDocRef.id,
        ...productData
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add the piece to the archives.'
    });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    
    // Remove the id from the body so we don't accidentally overwrite the Firebase document ID
    delete updateData.id; 

    const docRef = db.collection('products').doc(productId);
    await docRef.update(updateData);

    res.status(200).json({
      status: 'success',
      message: 'Archive updated successfully.'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update the archive.'
    });
  }
};

// @desc    Delete a product from Firestore
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await db.collection('products').doc(productId).delete();

    res.status(200).json({
      status: 'success',
      message: 'Item successfully removed from the vault.'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete the item.'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};