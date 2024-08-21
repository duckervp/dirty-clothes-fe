import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function ProductNoData({ query }) {
  return (
    <Paper
      sx={{
        textAlign: 'center',
        padding: 4
      }}
    >
      <Typography variant="h6" paragraph>
        Not found
      </Typography>

      <Typography variant="body2">
        No results found for &nbsp;
        <strong>&quot;{query}&quot;</strong> product.
        <br /> Try clearing all filters or try a different filter instead.
      </Typography>
    </Paper>
  );
}

ProductNoData.propTypes = {
  query: PropTypes.string,
};
