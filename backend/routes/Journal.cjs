const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry.cjs');
const { OpenAI } = require('openai');
const auth = require('../middleware/auth.cjs'); // ✅ import middleware


const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/create', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const userId = req.user.id;

    const prompt = `You are a JSON-only assistant.

Analyze the following journal entry and respond in ONLY valid JSON format.

Your response must include:
- A detailed summary of the entry (about 5 to 6 lines).
- A brief suggestion or advice to help the user feel better or improve their situation.
- The mood detected from the entry (choose from: Happy, Sad, Angry, Stressed, Neutral).

Respond strictly in this format:
{
  "summary": "...",
  "suggestion": "...",
  "mood": "Happy" // or Sad, Angry, Stressed, Neutral
}

Journal Entry: "${content}"`;

    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'AI service configuration error' });
    }

    const response = await openai.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      console.error('❌ Invalid response from AI service:', response);
      return res.status(500).json({ error: 'AI service returned invalid response' });
    }

    const rawContent = response.choices[0].message.content.trim();
    const match = rawContent.match(/\{[\s\S]*?\}/);

    if (!match) {
      console.error('❌ No valid JSON found in AI response:', rawContent);
      return res.status(500).json({ error: 'AI service returned invalid format' });
    }

    let analysis;
    try {
      analysis = JSON.parse(match[0]);
      
      // Validate required fields
      if (!analysis.summary || !analysis.mood) {
        console.error('❌ Missing required fields in AI analysis:', analysis);
        return res.status(500).json({ error: 'AI analysis incomplete' });
      }
    } catch (err) {
      console.error('❌ JSON parsing error:', err);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const newEntry = new JournalEntry({
      content: content.trim(),
      summary: analysis.summary,
      mood: analysis.mood,
      user: userId,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('❌ Server error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request to AI service' });
    } else if (error.status === 401) {
      return res.status(500).json({ error: 'AI service authentication failed' });
    } else if (error.status === 429) {
      return res.status(429).json({ error: 'AI service rate limit exceeded' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all journal entries (sorted by date, newest first)
router.get('/all', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error('❌ Failed to fetch journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});


router.put('/edit/:id', auth, async (req, res) => {
  const { content } = req.body;

  // Validate input
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const prompt = `You are a JSON-only assistant.

Analyze the following journal entry and respond in ONLY valid JSON format.

Your response must include:
- A detailed summary of the entry (about 5 to 6 lines).
- A brief suggestion or advice to help the user feel better or improve their situation.
- The mood detected from the entry (choose from: Happy, Sad, Angry, Stressed, Neutral).

Respond strictly in this format:
{
  "summary": "...",
  "suggestion": "...",
  "mood": "Happy" // or Sad, Angry, Stressed, Neutral
}

Journal Entry: "${content}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const raw = response.choices[0].message.content.trim();
    const match = raw.match(/\{[\s\S]*?\}/);
    if (!match) return res.status(500).json({ error: 'No valid JSON found' });

    const analysis = JSON.parse(match[0]);

    // Ensure user can only edit their own entries
    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        content: content.trim(),
        summary: analysis.summary,
        mood: analysis.mood,
        suggestions: analysis.suggestions || '',
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Entry not found or unauthorized' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Edit error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});




// server/routes/journal.js
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    // Ensure user can only delete their own entries
    const deleted = await JournalEntry.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!deleted) return res.status(404).json({ error: 'Entry not found or unauthorized' });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});



module.exports = router;
