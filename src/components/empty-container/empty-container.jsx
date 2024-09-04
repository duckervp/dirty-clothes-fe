import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

export default function EmptyContainer({ title, message }) {
  const { t } = useTranslation('product', { keyPrefix: 'cart.empty' });
  const router = useRouter();

  return (
    <Container>
      <Box sx={{ height: '40vh', pt: 5, textAlign: 'center' }}>
        <Typography variant="h2">{title}</Typography>
        <Box sx={{ ml: 0.45, mt: 3 }}>
          <Typography variant="body1">{message}</Typography>
          <Box sx={{ mt: 3 }}>
            <Button onClick={() => router.push('/')} variant="contained">
              {t('btn-continue-shopping')}
            </Button>
            <Button onClick={() => router.back()} sx={{ ml: 2 }} variant="outlined">
              {t('btn-go-back')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

EmptyContainer.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};
