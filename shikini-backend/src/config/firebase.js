const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

try {
  // Resolve the absolute path to your service account key file
  const serviceAccountPath = path.resolve(__dirname, '../../firebase-key.json');
  const serviceAccount = require(serviceAccountPath);

  // Initialize the Firebase Admin SDK using the new modular functions
  initializeApp({
    credential: cert(serviceAccount)
  });

  console.log('🔗 Secure connection to Firebase Cloud Vault established.');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

// Export the Firestore database instance so our controllers can use it
const db = getFirestore();

module.exports = { db };