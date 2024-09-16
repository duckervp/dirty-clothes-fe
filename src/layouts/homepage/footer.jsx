import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/material';
import Divider from '@mui/material/Divider';
import CallIcon from '@mui/icons-material/Call';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { useResponsive } from 'src/hooks/use-responsive';

import { selectCurrentLang } from 'src/app/api/lang/langSlice';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import Copyright from './copyright';
import store from './config-store-info';

// ----------------------------------------------------------------------

export default function Footer() {
  const { t } = useTranslation('translation', { keyPrefix: 'footer' });

  const mdUp = useResponsive('up', 'md');

  const currentLang = useSelector(selectCurrentLang);

  const renderContent = (
    <Box sx={{ pt: 3, pb: 5 }}>
      <Stack justifyContent="space-between" sx={{ flexDirection: { xs: "column", md: "row" } }}>
        <Box>
          <Typography sx={{ color: 'black', fontWeight: 'bold' }}>{t('store')}</Typography>
          <Box>
            {store[currentLang.value]?.branches?.map((branch) => (
              <Box key={branch.city} sx={{ color: '#000' }}>
                <Stack direction="row" alignItems="center">
                  <LocationOnIcon style={{ fontSize: 18 }} />
                  <Typography sx={{ ml: 1 }} variant='subtitle1'>{branch.city}</Typography>
                </Stack>
                {branch.stores.map((item) => (
                  <Stack direction={mdUp ? "row" : "column"} flexWrap="wrap" alignItems={mdUp ? "center" : "flex-start"} key={item.address} sx={{ ml: 3 }} spacing={mdUp ? 1 : 0}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 300 }}>{item.address}</Typography>
                    {store.displayBranchHotline && <Stack direction="row" alignItems="center" spacing={0.25}>
                      <CallIcon style={{ fontSize: 15 }} />
                      <Typography variant='subtitle2' sx={{ fontWeight: 300 }}>{item.hotline}</Typography>
                    </Stack>}
                  </Stack>
                ))}
              </Box>
            ))}
          </Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: "3px", mt: 0.5 }}>
            <Iconify icon="eva:phone-fill" sx={{ width: "15px" }} />
            <Typography variant='subtitle2'>{store.phone}</Typography>
          </Stack>
        </Box>

        {/* <Box sx={{ color: 'black', fontWeight: 'bold' }}>
          Store Policy
          <Stack>
            <Typography variant="subtitle2">Privacy Policy</Typography>
            <Typography variant="subtitle2">Member Card Policy</Typography>
            <Typography variant="subtitle2">Warranty & Return Policy</Typography>
            <Typography variant="subtitle2">Express Delivery Policy</Typography>
          </Stack>
        </Box> */}

        <Stack sx={{ mt: { xs: 2, md: 0 } }}>
          <Typography sx={{ color: 'black', fontWeight: 'bold' }}>{t('social-media')}</Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} justifyContent={mdUp ? "center" : "flex-start"}>
              <Box component={Link} to="https://www.facebook.com/profile.php?id=61562450362862" sx={{ color: "black" }}>
                <FacebookIcon />
              </Box>
              <Box component={Link} to="https://www.tiktok.com/@cotrangvietvutamthu" sx={{ color: "black" }}>
                <SvgColor src="/assets/icons/tiktok-icon.svg" sx={{ width: "16px" }} />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Box id="contact" sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    }}>
      <Container>
        {renderContent}
      </Container>
      <Divider />
      <Box
        component="footer"
        sx={{ py: 3 }}
      >
        <Copyright />
      </Box>
    </Box>
  );
}
