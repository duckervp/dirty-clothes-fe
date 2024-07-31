import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const UnauthorizedView = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ background: "aliceblue", height: "40vh", pt: 7, pl: 10 }}>
        <Typography variant="h2">
          Unauthorized
        </Typography>
        <Box sx={{ ml: 0.45, mt: 3 }}>
          <Typography variant="body1">
            You do not have access to the requested page.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button onClick={() => navigate("/", { replace: true })} variant="contained" >Home</Button>
            <Button onClick={() => navigate(-1)} sx={{ ml: 2 }} variant="outlined">Go Back</Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ background: "lightgray", height: "60vh" }} />
    </Box>

  );
}

export default UnauthorizedView;