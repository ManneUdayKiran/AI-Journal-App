import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,

} from '@mui/material';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentSadIcon from '@mui/icons-material/MoodBad';

const moodIcon = (mood) => {
  switch (mood.toLowerCase()) {
    case 'happy':
      return <SentimentVerySatisfiedIcon color="success" />;
    case 'sad':
      return <SentimentSadIcon color="primary" />;
    case 'stressed':
      return <SentimentDissatisfiedIcon color="warning" />;
    case 'angry':
      return <SentimentVeryDissatisfiedIcon color="error" />;
    case 'neutral':
      return <SentimentNeutralIcon color="action" />;
    case 'content':
      return <SentimentSatisfiedAltIcon color="success" />;
    case 'anxious':
      return <SentimentDissatisfiedIcon color="error" />;
    default:
      return <MoodIcon color="disabled" />;
  }
};


const getMoodColor = (mood) => {
  switch (mood.toLowerCase()) {
    case 'happy':
      return '#e8f5e9'; // light green
    case 'sad':
      return '#e3f2fd'; // light blue
    case 'angry':
      return '#ffebee'; // light red
    case 'neutral':
      return '#f5f5f5'; // light gray
    case 'content':
      return '#f1f8e9'; // very light lime
    case 'anxious':
    case 'stressed':
      return '#fff3e0'; // light orange
    default:
      return '#ffffff'; // white fallback
  }
};


export default function Timeline({ entries, handleDelete, setEntries }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEditOpen = (entry) => {
    setEditingEntry(entry);
    setEditText(entry.content);
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`https://ai-journal-app.onrender.com/api/journal/edit/${editingEntry._id}`, {
        content: editText,
      });
      setEntries((prev) =>
        prev.map((e) => (e._id === editingEntry._id ? res.data : e))
      );
      setEditingEntry(null);
      setEditText('');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <>
       <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        {entries.map((entry) => (
<Card key={entry._id || entry.id} elevation={4} sx={{ backgroundColor: getMoodColor(entry.mood) }}>
            <CardContent>
              {/* User Entry Section */}
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar alt="User" src="/user-avatar.png" />
                <Stack flex={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">  
                  <Typography variant="subtitle2" color="text.secondary">
                    You wrote:
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip icon={moodIcon(entry.mood)} label={entry.mood} variant="outlined" />
                      <Tooltip title="Edit Entry">
                        <IconButton onClick={() => handleEditOpen(entry)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Entry">
                        <IconButton onClick={() => handleDelete(entry._id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    </Stack>
                  <Typography variant="body1" gutterBottom>
                    {entry.content}
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* AI Response Section */}
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar alt="AI" src="/ai-avatar.png" />
                <Stack flex={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      AI Summary:
                    </Typography>
                    
                  </Stack>
                  <Typography variant="body2">{entry.summary}</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="caption">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={!!editingEntry} onClose={() => setEditingEntry(null)} maxWidth="md" fullWidth>
  <DialogTitle>Edit Journal Entry</DialogTitle>
  <DialogContent>
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 1 }}>
      <TextField
        multiline
        fullWidth
        rows={6}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
      />
    </Box>
  </DialogContent>
  <DialogActions sx={{ maxWidth: 800, mx: 'auto', mb: 1 }}>
    <Button onClick={() => setEditingEntry(null)}>Cancel</Button>
    <Button variant="contained" onClick={handleEditSave}>Save</Button>
  </DialogActions>
</Dialog>
    </>
  );
}
