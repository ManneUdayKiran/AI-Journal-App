// src/pages/JournalPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import {
  Typography,
  CircularProgress,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
} from '@mui/material';
import Navbar from '../components/NavBar';
import { Stack } from '@mui/material';


export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // modal control
  const [entry, setEntry] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ai-journal-app.onrender.com/api/journal/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(response.data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ai-journal-app.onrender.com/api/journal/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCreate = async () => {
    if (!entry.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://ai-journal-app.onrender.com/api/journal/create',
        { content: entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntries((prev) => [res.data, ...prev]); // update list instantly
      setOpen(false);
      setEntry('');
    } catch (err) {
      console.error('Create failed', err);
      alert('Failed to create entry');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <>
    <Navbar/>
    <Container sx={{ mt: 10 }}>
       <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  sx={{ mb: 3 }}
>
  <Typography variant="h4" fontWeight="bold">
    Journal Timeline
  </Typography>

  <Button
    variant="contained"
    size="medium"
    onClick={() => setOpen(true)}
    sx={{ textTransform: 'none', fontWeight: 600 }}
  >
    + Create New Entry
  </Button>
</Stack>

      {loading ? (
          <CircularProgress />
        ) : entries.length > 0 ? (
            <Timeline entries={entries} handleDelete={handleDelete} setEntries={setEntries} />
        ) : (
            <Typography>No journal entries yet.</Typography>
      )}

      {/* Create Entry Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth  height="auto"> 
        <DialogTitle>New Journal Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="What's on your mind?"
            multiline
            rows={6}
            fullWidth
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            style={{paddingTop: '10px', marginTop: '10px'}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={creating}>
            Cancel
          </Button>
         <Button onClick={handleCreate} variant="contained" disabled={creating}>
  {creating ? (
    <CircularProgress size={20} color="inherit" />
  ) : (
    'Save & Analyze'
  )}
</Button>
        </DialogActions>
      </Dialog>
    </Container>
            </>
  );
}
