import * as React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export default function AddressForm() {
  return (
    <Box>
      <TextField id="email" label="Email" variant="outlined" fullWidth sx={{mb: 1.5}}/>
      <TextField id="name" label="Name" variant="outlined" fullWidth sx={{mb: 1.5}}/>
      <TextField id="address" label="Address" variant="outlined" fullWidth sx={{mb: 1.5}}/>
      <TextField id="phone" label="Phone" variant="outlined" fullWidth sx={{mb: 1.5}}/>
      <TextField id="zip" label="Postal/Zip Code" variant="outlined" fullWidth sx={{mb: 1.5}}/>
      <TextField id="note" label="Note" variant="outlined" fullWidth/>
    </Box>
  );
}