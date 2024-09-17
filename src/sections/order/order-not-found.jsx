import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function OrderNoData({ query, manage }) {
  const { t } = useTranslation('profile', { keyPrefix: "order.filter-no-data" })
  return (
    <Paper
      sx={{
        textAlign: 'center',
        padding: 4
      }}
    >
      <Typography variant="h6" paragraph>
        {t('title')}
      </Typography>

      <Typography variant="body2">
        <Trans i18nKey={manage ? "order.filter-no-data.admin-content" : "order.filter-no-data.content"} ns='profile' values={{ query }}>
          No results found for &nbsp;
          <strong>&quot;{query}&quot;</strong> order.
          <br /> Try clearing all filters or try a different filter instead.
        </Trans>
      </Typography>

    </Paper>
  );
}

OrderNoData.propTypes = {
  query: PropTypes.string,
  manage: PropTypes.bool,
};
