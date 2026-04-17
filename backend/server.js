const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. PRO CORS FIX ---
// This allows your Vercel frontend to talk to this backend without security blocks
app.use(cors({
  origin: "*", // Allows any origin to ensure your Vercel link works immediately
  methods: ["GET", "POST"]
}));
app.use(express.json());

// --- 2. DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Cloud DB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// --- 3. DATA MODEL ---
const MedicalSchema = new mongoose.Schema({
  title: String,
  snippet: String,
  category: String
});
const MedicalData = mongoose.model('MedicalData', MedicalSchema);

// --- 4. ROUTES ---

// HOME: Fixes "Cannot GET /" and keeps Cron-Job active
app.get('/', (req, res) => {
  res.status(200).json({ status: "CuraLink Server Online", database: "Connected" });
});

// SEARCH: Main API for the frontend
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await MedicalData.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { snippet: { $regex: q, $options: 'i' } }
      ]
    }).limit(5);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Search Failed" });
  }
});

// HEALTH: For the Cron-Job
app.get('/health', (req, res) => res.status(200).send("Alive"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Perfection Server on Port ${PORT}`));