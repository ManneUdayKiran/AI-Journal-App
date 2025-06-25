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
    const userId = req.user.id; // ✅ from token

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

Journal Entry: "${content}"
`;


    const response = await new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    }).chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const rawContent = response.choices[0].message.content.trim();
    const match = rawContent.match(/\{[\s\S]*?\}/);

    if (!match) return res.status(500).json({ error: 'No valid JSON found' });

    let analysis;
    try {
      analysis = JSON.parse(match[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Invalid JSON from AI' });
    }

    const newEntry = new JournalEntry({
      content,
      summary: analysis.summary,
      mood: analysis.mood,
      user: userId, // ✅ associate user
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Server error' });
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
  try {
    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: req.body.content },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Entry not found or unauthorized' });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});



// server/routes/journal.js
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});



module.exports = router;
