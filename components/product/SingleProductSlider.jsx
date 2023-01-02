import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_URL } from "../../utils/connectionConfig";
import { Offer } from "../../utils/Calc";
import Image from "next/image";
import dynamic from "next/dynamic";

function SingleProductSliders({ productHover, type, product, setPImg }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [productImg, setProudctImg] = useState(
    product.productImg.data[0].attributes.name
  );
  const [pUrl, setPUrl] = useState(
    product.productImg.data[0].attributes.formats.thumbnail.url
  );

  useEffect(() => {
    setPImg(pUrl);
  }, [pUrl, setPImg]);

  return (
    <div className="w-full">
      <Slider asNavFor={nav2} ref={(slider) => setNav1(slider)} arrows={false}>
        {product.productImg.data.length &&
          product.productImg.data.map((pImg) => (
            <div
              key={pImg.attributes.name}
              className="relative flex h-full justify-center  overflow-hidden bg-gray-100"
            >
              <div className="absolute left-1 top-1">
                {product.offer > 0 && (
                  <div className=" bg-secondary  rounded px-2 py-0.5  text-white">
                    -{Offer(product.price, product.offer)}%
                  </div>
                )}
                <div className=" bg-primary my-1 rounded px-2 py-0.5  text-white">
                  new
                </div>
              </div>

              {
                <Image
                  src={pImg.attributes.url}
                  width={pImg.attributes.width}
                  height={pImg.attributes.height}
                  onMouseMoveCapture={() => {
                    setProudctImg(pImg.attributes.name);
                    setPUrl(pImg.attributes.url);
                  }}
                  layout="responsive"
                  objectFit="contain"
                  objectPosition="center"
                  loading="eager"
                  alt={pImg.attributes.name}
                  className={`w-full h-full object-contain cursor-grab `}
                />
              }
            </div>
          ))}
      </Slider>
      <Slider
        asNavFor={nav1}
        ref={(slider) => setNav2(slider)}
        slidesToShow={product.productImg.data.length}
        swipeToSlide={true}
        focusOnSelect={true}
        arrows={false}
        className="px-10 my-6 "
      >
        {product.productImg.data.length &&
          product.productImg.data.map((pImg) => (
            <div key={pImg.attributes.name} className="flex justify-center ">
              <div
                onClick={() => {
                  setProudctImg(pImg.attributes.name);
                  setPUrl(pImg.attributes.url);
                }}
                className={`relative bg-gray-100 w-10 h-10 md:w-16 md:h-16 overflow-hidden rounded-full border-2 ${
                  productImg === pImg.attributes.name
                    ? "border-secondary"
                    : "border-gray-400"
                } p-0.5`}
              >
                <Image
                  src={pImg.attributes.formats.thumbnail.url}
                  loading="eager"
                  objectFit="contain"
                  objectPosition="center"
                  layout="fill"
                  alt=""
                />
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SingleProductSliders), {
  ssr: false,
});
