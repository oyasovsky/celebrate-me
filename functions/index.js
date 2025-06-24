const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

app.post('/start', async (req, res) => {
  const { name, persona, stats, scroll, trials } = req.body;
  const docRef = await db.collection('celebrations').add({
    name,
    persona,
    stats,
    scroll,
    trials,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ id: docRef.id, link: `/celebrate/${name}?id=${docRef.id}` });
});

exports.api = functions.https.onRequest(app);
