import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Grid, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface ApiResponse {
  message: string;
  processed_file: string;
  density_plot: string;
  feature_importance: string;
}

interface FeatureImportance {
  [key: string]: number;
}

const useStyles = makeStyles({
  button: {
    backgroundColor: '#555 !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: '#777 !important',
    },
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  downloadButton: {
    backgroundColor: '#d3d3d3 !important',
    color: '#000 !important',
    '&:hover': {
      backgroundColor: '#c0c0c0 !important',
    },
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: '5px'
  },
  input: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  container: {
    marginTop: '20px',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#424242',
    color: '#d3d3d3',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  table: {
    backgroundColor: '#616161',
    color: '#d3d3d3',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  tableCell: {
    color: '#fff !important',
  },
  fileName: {
    marginLeft: '10px',
    color: '#d3d3d3',
  },
  message: {
    color: '#d3d3d3',
  },
  horizontalLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#d3d3d3',
    margin: '20px 0',
  },
  resultsText: {
    color: '#d3d3d3',
    marginTop: '10px',
  }
});

const UploadForm: React.FC = () => {
  const classes = useStyles();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [densityPlot, setDensityPlot] = useState<string | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance | null>(null);
  const [featureImportanceFile, setFeatureImportanceFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

      const featureImportanceResponse = await axios.get<FeatureImportance>(`${apiUrl}/download/${response.data.feature_importance}`);
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

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      setMessage('Error downloading file.');
    }
  };

  const hasResults = !!processedFile || !!densityPlot || !!featureImportance;

  return (
    <Box className={classes.container}>
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
      {message && (
        <Typography variant="body1" gutterBottom mt={2} className={classes.message}>
          {message}
        </Typography>
      )}
      {hasResults && (
        <Box>
          <Box className={classes.horizontalLine} />
          <Typography variant="h5" className={classes.resultsText}>
            Results
          </Typography>
          <Box className={classes.horizontalLine} />
        </Box>
      )}
      {processedFile && (
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item>
            <Button href={processedFile} download="processed_sample_submission.csv" className={classes.downloadButton}>
              Download submission
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => downloadFile(densityPlot!, 'density_plot.png')} className={classes.downloadButton}>
              Download density plot
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => downloadFile(featureImportanceFile!, 'top_five_feature.json')} className={classes.downloadButton}>
              Download best features
            </Button>
          </Grid>
        </Grid>
      )}
      {featureImportance && (
        <Box mt={2}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Feature</TableCell>
                <TableCell className={classes.tableCell}>Importance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(featureImportance).slice(0, 5).map(([feature, importance]) => (
                <TableRow key={feature}>
                  <TableCell className={classes.tableCell}>{feature}</TableCell>
                  <TableCell className={classes.tableCell}>{importance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      {densityPlot && (
        <Box mt={2}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">Density Plot</Typography>
            </CardContent>
            <CardMedia
              component="img"
              image={densityPlot}
              alt="Density Plot"
            />
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default UploadForm;
