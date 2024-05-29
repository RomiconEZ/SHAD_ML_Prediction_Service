import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import FeatureImportanceTable from './FeatureImportanceTable.tsx';
import DensityPlotCard from './DensityPlotCard.tsx';
import useStyles from '../styles/useStyles.ts';
import axios from 'axios';

interface ResultsProps {
  processedFile: string | null;
  densityPlot: string | null;
  featureImportance: { [key: string]: number } | null;
  featureImportanceFile: string | null;
}

const Results: React.FC<ResultsProps> = ({ processedFile, densityPlot, featureImportance, featureImportanceFile }) => {
  const classes = useStyles();

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
      // You should add setMessage here to display error message
    }
  };

  return (
    <Box>
      <Box className={classes.horizontalLine} />
      <Typography variant="h5" className={classes.resultsText}>
        Results
      </Typography>
      <Box className={classes.horizontalLine} />
      {processedFile && (
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item>
            <Button href={processedFile} download="submission.csv" className={classes.downloadButton}>
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
        <Box mt={2} mb={2}>
          <FeatureImportanceTable featureImportance={featureImportance} />
        </Box>
      )}
      {densityPlot && (
        <Box mt={2} mb={0}>
          <DensityPlotCard densityPlot={densityPlot} />
        </Box>
      )}
    </Box>
  );
};

export default Results;
