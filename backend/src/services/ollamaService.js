const axios = require('axios');

async function askOllama(prompt, contextData = "", history = "") {
  try {
    const fullPrompt = `
You are a medical research assistant. Use ONLY the provided data. Never hallucinate.

Previous conversation:
${history}

Fetched Research Data:
${contextData}

User Question: ${prompt}

Respond in STRICT JSON format only:
{
  "conditionOverview": "Short summary of the condition",
  "researchInsights": "Key findings from publications (2-3 bullet points)",
  "clinicalTrials": "Summary of relevant trials",
  "sources": [
    {
      "title": "...",
      "authors": "...",
      "year": "...",
      "platform": "PubMed / OpenAlex / ClinicalTrials.gov",
      "url": "...",
      "doiOrPmid": "...",
      "snippet": "..."
    }
  ]
}
`;

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3.2",
      prompt: fullPrompt,
      stream: false,
      temperature: 0.3
    });

    let jsonStr = response.data.response.trim();
    if (jsonStr.startsWith("```json")) jsonStr = jsonStr.replace(/```json|```/g, "");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Ollama Error:", error.message);
    return { conditionOverview: "Error", researchInsights: "Ollama not responding", clinicalTrials: "", sources: [] };
  }
}

module.exports = { askOllama };