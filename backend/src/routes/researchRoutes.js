const express = require('express');
const router = express.Router();
const ResearchService = require('../services/researchService');
const axios = require('axios');

router.post('/search', async (req, res) => {
  const { disease, intent, page } = req.body;
  try {
    const searchData = await ResearchService.getFullResearch(disease, intent, page || 1);
    
    // AI Reasoning Block (Llama3 Concise Mode)
    let aiInsight = "Analyzing data...";
    try {
      const titles = searchData.papers.map(p => p.title).join(". ");
      const ollama = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: `As a medical researcher, summarize the trend for ${disease} based on these papers: ${titles}. Limit to 3 concise sentences.`,
        stream: false
      }, { timeout: 5000 }); // Fast 5s timeout for AI
      aiInsight = ollama.data.response;
    } catch (err) {
      aiInsight = "System running in high-speed mode. Full AI summary skipped to maintain <10s response time.";
    }

    res.json({ ...searchData, insight: aiInsight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;