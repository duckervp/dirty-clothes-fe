import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { selectCurrentUser } from 'src/app/api/auth/authSlice';


export default function AccountDisplay() {
  const user = useSelector(selectCurrentUser);

  const renderAccount = (
    <Box
      sx={{
        my: 2,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={user?.avatarUrl || null} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{user?.name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user?.role}
        </Typography>
      </Box>
    </Box>
  );

  return user ? renderAccount : <Box sx={{ my: 2 }} />;
}