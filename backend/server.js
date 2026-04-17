const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Database Linked & Ready"))
  .catch(err => console.error("❌ DB Connection Failed:", err));

// 2. Professional Medical Schema
const MedicalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  category: String,
  source: { type: String, default: "Verified Medical Index" }
});
const MedicalData = mongoose.model('MedicalData', MedicalSchema);

// 3. Root Route (Fixes 'Cannot GET /')
app.get('/', (req, res) => {
  res.json({
    status: "Online",
    system: "CuraLink Production API",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime()
  });
});

// 4. Advanced Search Engine
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    // Searches both Title and Snippet for the query string
    const results = await MedicalData.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { snippet: { $regex: q, $options: 'i' } }
      ]
    }).limit(5);

    if (results.length > 0) {
      res.json(results);
    } else {
      res.json([{ 
        title: "CuraLink AI Note", 
        snippet: `I searched our records for "${q}" but found no direct matches. Please consult a professional for clinical advice.` 
      }]);
    }
  } catch (error) {
    res.status(500).json({ error: "Search Engine Error" });
  }
});

// 5. Health Check for Cron-Job
app.get('/health', (req, res) => res.status(200).send("Alive"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server Active on Port ${PORT}`));