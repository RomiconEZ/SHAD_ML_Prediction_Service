import { makeStyles } from '@mui/styles';

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
    marginTop: '20px',
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
    margin: '15px 0',
  },
  resultsText: {
    color: '#d3d3d3',
    marginTop: '10px',
  }
});

export default useStyles;
