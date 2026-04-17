require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const mongoose = require('mongoose');

const app = express();

// ✅ OPEN CORS (The "Nuclear" option for Hackathons)
app.use(cors({ origin: "*" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ DATABASE TIMEOUT PROTECTION
mongoose.connect(process.env.MONGO_URI, { connectTimeoutMS: 10000 })
  .then(() => console.log("✅ DB Online"))
  .catch(err => console.error("❌ DB Offline:", err));

app.post('/api/research/search', async (req, res) => {
  const { query, disease } = req.body;
  if (!query || !disease) return res.status(400).json({ error: "Missing data" });

  try {
    // 1. Fetch 7 High-Quality Citations
    const alexRes = await fetch(`https://api.openalex.org/works?search=${disease}`).then(r => r.json());
    const evidence = alexRes.results.slice(0, 7).map(w => ({
      title: w.display_name,
      year: w.publication_year,
      author: w.authorships[0]?.author?.display_name || "Medical Research Staff"
    }));

    // 2. Chat-GPT Style Synthesis
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are CuraLink Pro. Provide detailed, expert clinical audits. Use bullet points." },
        { role: "user", content: `Audit ${disease} for ${query}. Context: ${JSON.stringify(evidence)}` }
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({ summary: completion.choices[0].message.content, evidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Inference Engine Latency" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Port ${PORT} Open`));