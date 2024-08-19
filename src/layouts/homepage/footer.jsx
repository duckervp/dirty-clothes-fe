import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CallIcon from '@mui/icons-material/Call';
import Typography from '@mui/material/Typography';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Copyright from './copyright';
import store_branchs from './config-store-branches';

// ----------------------------------------------------------------------

export default function Footer() {
  const renderContent = (
    <Box sx={{ px: { lg: 5 }, pt: 3, pb: 5, background: (theme) => theme.palette.grey[200]}}>
      <Stack direction="row" justifyContent="space-around" flexWrap="wrap">
        <Box>
          <Box sx={{ color: 'black', fontWeight: 'bold' }}>Dirty Clothes Branches</Box>
          <Box sx={{ ml: 2 }}>
            {store_branchs.map((branch) => (
              <Box key={branch.city} sx={{ color: '#000' }}>
                <Stack direction="row" alignItems="center">
                  <LocationOnIcon style={{ fontSize: 18 }} />
                  <Typography sx={{ ml: 1 }} variant='subtitle1'>{branch.city}</Typography>
                </Stack>
                {branch.stores.map((store) => (
                  <Stack direction="row" alignItems="center" key={store.address} sx={{ ml: 3 }}>
                    <Typography variant='subtitle2'>{store.address}</Typography>
                    <CallIcon style={{ fontSize: 15 }} sx={{ ml: 2 }} />
                    <Typography variant='subtitle2'>{store.hotline}</Typography>
                  </Stack>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ color: 'black', fontWeight: 'bold' }}>
          Store Policy
          <Stack>
            <Typography variant="subtitle2">Privacy Policy</Typography>
            <Typography variant="subtitle2">Member Card Policy</Typography>
            <Typography variant="subtitle2">Warranty & Return Policy</Typography>
            <Typography variant="subtitle2">Express Delivery Policy</Typography>
          </Stack>
        </Box>

        <Box sx={{ color: 'black', fontWeight: 'bold' }}>
          Social Media
          <Stack>
            <Stack direction="row">
              <FacebookIcon />
              <Typography variant="subtitle2" sx={{ml: 1}}>fb.com/dirty-clothes</Typography>
            </Stack>
            <Stack direction="row">
              <YouTubeIcon />
              <Typography variant="subtitle2" sx={{ml: 1}}>youtube.com/dirty-clothes</Typography>
            </Stack>
            <Stack direction="row">
              <InstagramIcon />
              <Typography variant="subtitle2" sx={{ml: 1}}>instagram.com/dirty-clothes</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box id="contact">
      {renderContent}
      <Divider />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Copyright />
      </Box>
    </Box>
  );
}
