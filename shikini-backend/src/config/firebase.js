const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config(); // Ensure we can read environment variables locally

try {
  let serviceAccount;

  // If we are in production (Render), read the key from the secure environment variable
  if (process.env.NODE_ENV === 'production') {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // If we are testing locally, read from the local file
    const path = require('path');
    const serviceAccountPath = path.resolve(__dirname, '../../firebase-key.json');
    serviceAccount = require(serviceAccountPath);
  }

  initializeApp({
    credential: cert(serviceAccount)
  });

  console.log('🔗 Secure connection to Firebase Cloud Vault established.');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = getFirestore();
module.exports = { db };