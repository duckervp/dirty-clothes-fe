import React from 'react';
import Slider from 'react-slick';

import Box from '@mui/material/Box';

function HomeBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
  };
  return (
    <Box className="slider-container" sx={{ boxShadow: 2}}>
      <Slider {...settings}>
        <Box>
          <img
            src="https://bizweb.dktcdn.net/100/369/010/themes/914385/assets/slide-img1.jpg?1720758661032"
            alt=""
            style={{objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
        <Box>
          <img
            src="https://bizweb.dktcdn.net/100/369/010/themes/914385/assets/slide-img5.jpg?1720758661032"
            alt=""
            style={{objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
        <Box>
          <img
            src="https://bizweb.dktcdn.net/100/369/010/themes/914385/assets/slide-img1.jpg?1720758661032"
            alt=""
            style={{objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
        <Box>
          <img
            src="https://bizweb.dktcdn.net/100/369/010/themes/914385/assets/slide-img3.jpg?1720758661032"
            alt=""
            style={{objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
      </Slider>
    </Box>
  );
}

export default HomeBanner;
