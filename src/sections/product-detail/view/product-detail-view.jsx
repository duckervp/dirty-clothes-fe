import { useState } from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import Stack from '@mui/material/Stack';

const images = [
  {
    original:
      'https://images.unsplash.com/photo-1721146609543-491c1ec04240?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnail:
      'https://images.unsplash.com/photo-1721146609543-491c1ec04240?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/1000/600/',
    // originalWidth: 1000,
    // originalHeight: 600,
  },
];

const colors = ['Red', 'Hot Pink', 'Green'];
const sizes = ['Size S', 'Size M', 'Size L', 'Size XXL'];

function ToggleButtons({data}) {
  const [view, setView] = useState('list');

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return (
      <ToggleButtonGroup
        orientation="horizontal"
        value={view}
        exclusive
        onChange={handleChange}
      >
        <Box sx={{display: 'flex', flexWrap: "wrap"}}>
          {data.map((item) => (
              <ToggleButton
                key={item}
                value={item}
                aria-label={item}
                style={{ border: '1px solid rgba(145, 158, 171, 0.2)', borderRadius: 0, width: 80, padding: "5px 8px"}}
                sx={{m: .5, fontWeight: 100}}
              >
                {item}
              </ToggleButton>
          ))}
        </Box>
      </ToggleButtonGroup>
  );
}

ToggleButtons.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string)
};

export default function ProductDetail() {
  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={5}>
        <Grid xs={12} sm={12} md={8}>
          <ImageGallery
            items={images}
            showFullscreenButton={false}
            showPlayButton={false}
            showNav={false}
          />
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Typography variant="h4" textAlign="center" fontWeight={500} marginBottom={0.5}>
            Product name very very long long long long
          </Typography>
          <Typography textAlign="center" marginBottom={0.5} variant='body1'>900.000VND</Typography>
          
          <Box marginBottom={1}>
            <ToggleButtons data={colors} />
          </Box>
          <Box marginBottom={1}>
            <ToggleButtons data={sizes} />
          </Box>

          <Button variant="outlined" fullWidth sx={{borderRadius: "5px", mb: 1.5 }}>ADD TO CART</Button>
          <Button variant="contained" fullWidth sx={{borderRadius: "5px"}} >BUY NOW</Button>
          
          <Box sx={{mt: 2}}>
            <Typography sx={{fontWeight: "bold"}}>Description</Typography>
            Detail Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa cumque atque culpa,
            amet, a corrupti reprehenderit quia non ad sit sequi beatae, aliquam ratione eaque sed.
            Ullam dolorum odio excepturi. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Quis rerum corrupti asperiores corporis aliquid atque similique a quod pariatur
            architecto dolorum hic id, inventore obcaecati maiores sed labore possimus. Numquam?
          </Box>
        </Grid>
      </Grid>

      <Box>
        <Typography variant='h5'>Other products</Typography>
      </Box>
    </Container>
  );
}
