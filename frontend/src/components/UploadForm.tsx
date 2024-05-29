import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import FileUpload from './FileUpload.tsx';
import Results from './Results.tsx';
import useStyles from '../styles/useStyles.ts';

const UploadForm: React.FC = () => {
  const classes = useStyles();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [densityPlot, setDensityPlot] = useState<string | null>(null);
  const [featureImportance, setFeatureImportance] = useState<{ [key: string]: number } | null>(null);
  const [featureImportanceFile, setFeatureImportanceFile] = useState<string | null>(null);

  const hasResults = !!processedFile || !!densityPlot || !!featureImportance;

  return (
    <Box className={classes.container}>
      <FileUpload
        file={file}
        setFile={setFile}
        setMessage={setMessage}
        setLoading={setLoading}
        setProcessedFile={setProcessedFile}
        setDensityPlot={setDensityPlot}
        setFeatureImportance={setFeatureImportance}
        setFeatureImportanceFile={setFeatureImportanceFile}
        loading={loading}  // Добавлен пропс loading
      />
      {message && (
        <Typography variant="body1" gutterBottom mt={2} className={classes.message}>
          {message}
        </Typography>
      )}
      {hasResults && <Results processedFile={processedFile} densityPlot={densityPlot} featureImportance={featureImportance} featureImportanceFile={featureImportanceFile} />}
    </Box>
  );
};

export default UploadForm;
