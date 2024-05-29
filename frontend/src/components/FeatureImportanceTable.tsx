import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import useStyles from '../styles/useStyles.ts';

interface FeatureImportanceTableProps {
  featureImportance: { [key: string]: number };
}

const FeatureImportanceTable: React.FC<FeatureImportanceTableProps> = ({ featureImportance }) => {
  const classes = useStyles();

  return (
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
  );
};

export default FeatureImportanceTable;
