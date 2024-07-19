import React from 'react';
import Slider from 'react-slick';

function LazyLoadBanner() {
  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img
            src="https://plus.unsplash.com/premium_photo-1719850361442-dd4203f47fb9?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            style={{height: '500px', width: "100%", objectFit: "cover", borderRadius: "5px"}}
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1721146609543-491c1ec04240?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            style={{height: '500px', width: "100%", objectFit: "cover", borderRadius: "5px"}}
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1721086130975-83605296fdbb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            style={{height: '500px', width: "100%", objectFit: "cover", borderRadius: "5px"}}
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1721163202587-f1f7ba17c0cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            style={{height: '500px', width: "100%", objectFit: "cover", borderRadius: "5px"}}
          />
        </div>
      </Slider>
    </div>
  );
}

export default LazyLoadBanner;
