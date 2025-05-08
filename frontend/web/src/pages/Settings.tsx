import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLanguage, setAvailableLanguages } from '../store/settingsSlice';
import axios from 'axios';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { language, availableLanguages } = useSelector(
    (state: RootState) => state.settings
  );
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/languages');
        dispatch(setAvailableLanguages(response.data.languages));
      } catch (err) {
        setError('Failed to fetch available languages');
        console.error('Error fetching languages:', err);
      }
    };

    fetchLanguages();
  }, [dispatch]);

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setLanguage(event.target.value as string));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Language Settings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={language}
              label="Language"
              onChange={handleLanguageChange}
            >
              {availableLanguages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: Changing the language will affect the speech recognition model
            used for exercises.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings; 