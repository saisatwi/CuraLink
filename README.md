# 🎯 CuraLink — AI Medical Research Assistant

CuraLink is a professional, high-precision **MERN Stack** application designed for the AI Medical Research Assistant Hackathon. It acts as a comprehensive research + reasoning system that audits global clinical databases and synthesizes findings using a custom **Llama 3** model via **Ollama**.

---

### 🌐 Live Deployment
* **Live Application:** [https://curalink-rouge.vercel.app/](https://curalink-rouge.vercel.app/)
* **Production Backend:** [https://curalink-backend-73rv.onrender.com/](https://curalink-backend-73rv.onrender.com/)
* **Demo Video:** [Part 1: https://www.loom.com/share/b52d22d9f77a4a939c1168f514ed29ac] [Part 2: https://www.loom.com/share/321e184013f448fe95b010c9c6b0c9dd]
---

### 🚀 Core Research Capabilities

* **Multi-Source Aggregator:** Performs real-time auditing of **PubMed**, **OpenAlex**, and **ClinicalTrials.gov**.
* **Intelligent Query Expansion:** Automatically expands structured inputs (Disease + Intent + Location) into complex boolean queries to ensure deep, context-aware retrieval.
* **Custom LLM Reasoning (Ollama):** Integrates **Llama 3** to reason over abstracts and trial data, generating structured, source-backed summaries without hallucinations.
* **Advanced UI/UX:**
    * **Chat-Centric Interface:** Designed for intuitive, professional medical exploration.
    * **Selected Toggles:** Instant UI filtering to switch views between specific API sources.
    * **Smart Pagination:** High-speed navigation through deep research candidate pools (50–300 results).
    * **Full Source Attribution:** Every insight includes authors, publication year, and direct URLs.

---

### 🛠️ Technical Architecture

* **Frontend:** React.js, Tailwind CSS (Dark Mode), Lucide Icons
* **Backend:** Node.js, Express.js, Axios
* **Database:** MongoDB Atlas (Session persistence and research fallbacks)
* **AI Engine:** Ollama / Llama 3 (Local Inference)
* **Infrastructure:** Vercel (Frontend) & Render (Backend)

---

### 📐 System Pipeline

1.  **Input Phase:** User provides structured context (e.g., *Parkinson's Disease* + *Deep Brain Stimulation*).
2.  **Retrieval Phase:** Parallel API calls fetch raw data from all three global sources simultaneously.
3.  **Reasoning Phase:** The backend feeds source snippets into **Ollama** for synthesis, ranking, and summarization.
4.  **Display Phase:** The UI renders a structured summary followed by paginated, clickable research cards.

---

### 💻 Local Development Setup

To run the full reasoning engine (Ollama) locally:

1.  **Clone & Install:**
    ```bash
    git clone [https://github.com/your-username/curalink.git](https://github.com/saisatwi/curalink.git)
    cd curalink/backend && npm install
    cd ../frontend && npm install
    ```
2.  **Environment Setup:** Create a `.env` file in the `/backend` directory:
    ```env
    MONGO_URI=your_mongodb_atlas_string
    PORT=10000
    ```
3.  **Start Engine:** Ensure **Ollama** is running (`ollama run llama3`).
4.  **Launch:** Run `npm start` in both `/backend` and `/frontend` folders.

---

### 💡 Evaluation Notes
* **Precision & Depth:** I successfully implemented a "Depth-First" retrieval strategy, pulling broad candidate sets before refining them for the final response.
* **Technical Compliance:** Strictly adheres to the requirement of using an open-source model (Llama 3) for the reasoning layer.
* **End-to-End Execution:** The project is fully deployed, precisely tuned, and supports multi-turn conversations with context awareness.
