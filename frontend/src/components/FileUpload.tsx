import React, { ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import useStyles from '../styles/useStyles.ts';

interface FileUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessedFile: React.Dispatch<React.SetStateAction<string | null>>;
  setDensityPlot: React.Dispatch<React.SetStateAction<string | null>>;
  setFeatureImportance: React.Dispatch<React.SetStateAction<{ [key: string]: number } | null>>;
  setFeatureImportanceFile: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean; // Добавлен пропс loading
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  setFile,
  setMessage,
  setLoading,
  setProcessedFile,
  setDensityPlot,
  setFeatureImportance,
  setFeatureImportanceFile,
  loading // Добавлен пропс loading
}) => {
  const classes = useStyles();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>(`${apiUrl}/uploadfile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('');  // Clear any previous messages
      setProcessedFile(`${apiUrl}/download/${response.data.processed_file}`);
      setDensityPlot(`${apiUrl}/download/${response.data.density_plot}`);
      setFeatureImportanceFile(`${apiUrl}/download/${response.data.feature_importance}`);

      const featureImportanceResponse = await axios.get<{ [key: string]: number }>(`${apiUrl}/download/${response.data.feature_importance}`);
      setFeatureImportance(featureImportanceResponse.data);

      // Clear the selected file after successful processing
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (axios.isAxiosError(error)) {
        setMessage('Error uploading file: ' + (error.response?.data?.detail || error.message));
      } else {
        setMessage('Error uploading file.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <input
            ref={fileInputRef}
            accept="*"
            className={classes.input}
            id="upload-button"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-button" className={classes.uploadLabel}>
            <Button component="span" variant="contained" className={classes.button}>
              Choose File
            </Button>
          </label>
        </Grid>
        {file && (
          <Grid item>
            <Typography variant="body1" className={classes.fileName}>
              {file.name}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" type="submit" className={classes.button} disabled={loading}>
            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Upload'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FileUpload;
