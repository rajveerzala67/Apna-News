import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple stop words list for local sentence frequency summarization
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now'
]);

/**
 * Perform a frequency-based extractive summarization on a piece of text
 */
function localHeuristicSummarize(text, sentenceCount = 3) {
  if (!text || text.length < 50) {
    return text || "Summary not available for short contents.";
  }

  // Split text into sentences (handles standard punctuation followed by space/newline)
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (sentences.length <= sentenceCount) {
    return sentences.join(' ');
  }

  // Tokenize and count word frequencies
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);

  const wordFrequencies = {};
  let maxFreq = 0;

  words.forEach(word => {
    if (word && !STOP_WORDS.has(word)) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
      if (wordFrequencies[word] > maxFreq) {
        maxFreq = wordFrequencies[word];
      }
    }
  });

  // Normalize word frequencies
  if (maxFreq > 0) {
    Object.keys(wordFrequencies).forEach(word => {
      wordFrequencies[word] = wordFrequencies[word] / maxFreq;
    });
  }

  // Score sentences based on word frequencies
  const sentenceScores = sentences.map((sentence, idx) => {
    const sentenceWords = sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);

    let score = 0;
    sentenceWords.forEach(word => {
      if (wordFrequencies[word]) {
        score += wordFrequencies[word];
      }
    });

    // Penalize extremely long or short sentences slightly, and prioritize first sentence
    const lengthPenalty = sentenceWords.length > 30 || sentenceWords.length < 5 ? 0.7 : 1.0;
    const positionBonus = idx === 0 ? 1.5 : (idx === 1 ? 1.2 : 1.0);

    return {
      index: idx,
      text: sentence,
      score: (score / (sentenceWords.length || 1)) * lengthPenalty * positionBonus
    };
  });

  // Sort by score and pick top N sentences
  const topSentences = [...sentenceScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index); // Sort back to original chronological order

  return topSentences.map(s => s.text).join(' ');
}

/**
 * Generate a smart news summary. Uses Google Gemini model if API key is present.
 * Falls back to frequency-based sentence ranker otherwise.
 */
export async function generateSummary(title, content, url) {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      // Set up Google Gen AI SDK
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a professional editor for Apna News. Write a concise, engaging summary of the following news article. 
      Keep it around 3-4 bullet points or a single paragraph of 80 words maximum. Ensure it captures the core story.
      
      Article Title: ${title}
      Article Content: ${content || 'No details provided. Read more at the link.'}
      Link: ${url || ''}`;

      const response = await model.generateContent(prompt);
      const summaryText = response.text;
      
      if (summaryText) {
        return summaryText.trim();
      }
    } catch (error) {
      console.error('Gemini AI summary generation failed, falling back to local NLP:', error.message);
    }
  }

  // Fallback to local heuristic extractor
  const textToSummarize = `${title}. ${content || ''}`;
  return localHeuristicSummarize(textToSummarize, 3);
}
