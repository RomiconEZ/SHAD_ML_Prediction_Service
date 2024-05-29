import React from 'react';
import { Card, CardMedia } from '@mui/material';
import useStyles from '../styles/useStyles.ts';

interface DensityPlotCardProps {
  densityPlot: string;
}

const DensityPlotCard: React.FC<DensityPlotCardProps> = ({ densityPlot }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ backgroundColor: '#5e5e6b' }}>
      <CardMedia
        component="img"
        image={densityPlot}
        alt="Density Plot"
      />
    </Card>
  );
};

export default DensityPlotCard;
