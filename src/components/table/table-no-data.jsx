import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  const { t } = useTranslation('table')
  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            {t('title')}
          </Typography>

          <Typography variant="body2">
            <Trans i18nKey="content" ns='table'>
              No results found for &nbsp;
              <strong>&quot;{query}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Trans>
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
