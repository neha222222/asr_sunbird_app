import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useSelector((state: RootState) => state.settings);

  // Mock data - in a real app, this would come from an API
  const progress = {
    exercisesCompleted: 12,
    totalExercises: 20,
    accuracy: 85,
    timeSpent: '2h 30m',
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Sunbird ALL
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Exercises Completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(progress.exercisesCompleted / progress.totalExercises) * 100}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="body2">
                  {progress.exercisesCompleted} of {progress.totalExercises} completed
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Accuracy
                </Typography>
                <Typography variant="h4">{progress.accuracy}%</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Time Spent
                </Typography>
                <Typography variant="h4">{progress.timeSpent}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<MicIcon />}
                  onClick={() => navigate('/exercise')}
                  size="large"
                >
                  Start New Exercise
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                  onClick={() => navigate('/settings')}
                  size="large"
                >
                  Change Language ({language})
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 