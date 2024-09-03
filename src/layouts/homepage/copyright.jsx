import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Copyright(props) {
  return (
    <Box>
      <Container>
        <Typography variant="body2" color="text.primary" align="center" {...props}>
          {'Copyright © '}
          {new Date().getFullYear()}
          {' '}
          Co Trang Viet VTT
          {/* . Powered by
          {' '}
          <Link color="inherit" href="">
            Ghost
          </Link> */}
        </Typography>
      </Container>
    </Box>
  );
}
