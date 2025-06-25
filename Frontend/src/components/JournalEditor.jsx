import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Lottie from 'lottie-react';
import Navbar from './NavBar';
// import writeAnimation from '../lottie/write.json'; // Optional Lottie animation

export default function JournalEditor() {
  const [entry, setEntry] = useState('');
  const [summary, setSummary] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // ✅ Get JWT token
      const res = await axios.post(
        'https://ai-journal-app.onrender.com/api/journal/create',
        { content: entry },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add token to header
          },
        }
      );

      setSummary(res.data.summary);
      setMood(res.data.mood);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze your entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        What's on your mind today?
      </Typography>

      {/* Optional Lottie Animation */}
      {/* <Lottie animationData={writeAnimation} style={{ height: 200 }} /> */}

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <TextField
          label="Your Journal Entry"
          multiline
          fullWidth
          rows={8}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save & Analyze'}
        </Button>

        {summary && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">📝 Summary:</Typography>
            <Typography variant="body1">{summary}</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              😌 Mood Detected:
            </Typography>
            <Typography variant="body1">{mood}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
    </>
  );
}
