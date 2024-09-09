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
    <Box className="slider-container" sx={{ boxShadow: 2 }}>
      <Slider {...settings}>
        <Box>
          <img
            src="https://de8xyz7b91owd.cloudfront.net/banner/banner2.jpg"
            alt=""
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
        <Box>
          <img
            src="https://de8xyz7b91owd.cloudfront.net/banner/banner3.jpg"
            alt=""
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
        <Box>
          <img
            src="https://de8xyz7b91owd.cloudfront.net/banner/banner1.jpg"
            alt=""
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />
        </Box>
      </Slider>
    </Box>
  );
}

export default HomeBanner;
