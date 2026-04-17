const axios = require('axios');

// Query Expansion
function expandQuery(query, disease) {
  return disease ? `${query} ${disease}`.trim() : query;
}

// Clinical Trials
async function getClinicalTrials(disease, limit = 8) {
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(disease)}&filter.overallStatus=RECRUITING&pageSize=${limit}&format=json`;
    const res = await axios.get(url);
    return (res.data.studies || []).map(study => ({
      title: study.protocolSection?.identificationModule?.briefTitle || "Untitled Trial",
      status: study.protocolSection?.statusModule?.overallStatus || "Unknown",
      location: study.protocolSection?.contactsLocationsModule?.locations?.[0]?.city || "Various",
      url: `https://clinicaltrials.gov/study/${study.protocolSection?.identificationModule?.nctId}`,
      source: "ClinicalTrials.gov"
    })).slice(0, 6);
  } catch (e) {
    return [];
  }
}

// OpenAlex
async function getOpenAlexPapers(query, limit = 8) {
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${limit}&sort=relevance_score:desc`;
    const res = await axios.get(url);
    return res.data.results.map(paper => ({
      title: paper.title,
      authors: paper.authorships?.map(a => a.author.display_name).slice(0, 3).join(", ") || "Unknown",
      year: paper.publication_year || "N/A",
      doi: paper.doi ? paper.doi.replace("https://doi.org/", "") : null,
      url: paper.doi || paper.url || "#",
      snippet: (paper.abstract || "").substring(0, 180) + "...",
      source: "OpenAlex"
    })).slice(0, 6);
  } catch (e) {
    return [];
  }
}

// PubMed
async function getPubMedPapers(query, limit = 8) {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&sort=pub+date&retmode=json`;
    const searchRes = await axios.get(searchUrl);
    const ids = searchRes.data.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const fetchRes = await axios.get(fetchUrl);

    return Object.values(fetchRes.data.result || {}).filter(item => item.title).map(item => ({
      title: item.title,
      authors: item.authors?.map(a => a.name).slice(0, 3).join(", ") || "Unknown",
      year: item.pubdate?.substring(0, 4) || "N/A",
      pmid: item.uid,
      url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}`,
      snippet: item.abstract || "No abstract",
      source: "PubMed"
    })).slice(0, 6);
  } catch (e) {
    return [];
  }
}

module.exports = { getClinicalTrials, getOpenAlexPapers, getPubMedPapers };