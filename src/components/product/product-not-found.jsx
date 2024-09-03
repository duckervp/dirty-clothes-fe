import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function ProductNoData({ query }) {
  const { t } = useTranslation('product', { keyPrefix: "no-data" })
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
        <Trans i18nKey="no-data.content" ns='product' values={{ query }}>
          No results found for &nbsp;
          <strong>&quot;{query}&quot;</strong> product.
          <br /> Try clearing all filters or try a different filter instead.
        </Trans>
      </Typography>
    </Paper>
  );
}

ProductNoData.propTypes = {
  query: PropTypes.string,
};
