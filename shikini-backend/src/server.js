const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebase');

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// 📦 VAULT INVENTORY ROUTES (PRODUCTS)
// ==========================================

// 1. Get ALL pieces (For Archives & Admin)
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to access the vault." });
  }
});

// 2. Get ONE piece by ID (THE MISSING ROUTE FOR PRODUCT DETAILS!)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('products').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: "Piece not found in the vault." });
    }
    
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ message: "Failed to retrieve piece details." });
  }
});

// 3. Add a new piece
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    newProduct.createdAt = new Date().toISOString();
    
    const docRef = await db.collection('products').add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add piece to vault." });
  }
});

// 4. Update a piece
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    await db.collection('products').doc(id).update(updatedData);
    res.status(200).json({ message: "Piece updated successfully." });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update piece." });
  }
});

// 5. Delete a piece
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).delete();
    res.status(200).json({ message: "Piece removed from archives." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete piece." });
  }
});

// ==========================================
// 🧾 ORDER MANAGEMENT ROUTES 
// ==========================================

// Get all orders 
app.get('/api/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to retrieve order history." });
  }
});

// Create a new order 
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    orderData.createdAt = new Date().toISOString();
    
    const docRef = await db.collection('orders').add(orderData);
    res.status(201).json({ id: docRef.id, ...orderData });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to process order." });
  }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.collection('orders').doc(id).update({ status });
    res.status(200).json({ message: "Order status updated successfully." });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
});

// ==========================================
// 🚀 INITIALIZE SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================`);
  console.log(` 💎 SHIKINI VAULT SERVER ACTIVE`);
  console.log(` 🌐 PORT: ${PORT}`);
  console.log(`======================================\n`);
});