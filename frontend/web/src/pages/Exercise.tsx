import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

const Exercise: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const selectedLanguage = useSelector((state: RootState) => state.settings.language);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Connect to WebSocket
      wsRef.current = new WebSocket('ws://localhost:8000/ws/asr');
      
      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        setTranscript(response.text);
        setConfidence(response.confidence);
      };

      wsRef.current.onerror = (error) => {
        setError('WebSocket error occurred');
        console.error('WebSocket error:', error);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(event.data);
          }
        }
      };

      mediaRecorder.start(100); // Send data every 100ms
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Error accessing microphone');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      wsRef.current?.close();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Speech Exercise
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Language: {selectedLanguage}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              color={isRecording ? 'secondary' : 'primary'}
              startIcon={isRecording ? <StopIcon /> : <MicIcon />}
              onClick={isRecording ? stopRecording : startRecording}
              sx={{ minWidth: 200 }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Box>

          {isRecording && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            Transcript:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {transcript || 'Speak to see the transcript...'}
          </Typography>

          {confidence > 0 && (
            <Typography variant="body2" color="text.secondary">
              Confidence: {(confidence * 100).toFixed(1)}%
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Exercise; 