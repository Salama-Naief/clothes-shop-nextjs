import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../product/ProductCard";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

// arrows
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <BsArrowRight
      className={`z-10 absolute top-1/2 right-0 md:-right-1 cursor-pointer text-secondary text-3xl md:text-5xl`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}
//arrows
function SampleprevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <BsArrowLeft
      className={`z-10 absolute top-1/2 left-0 md:-left-1 cursor-pointer text-secondary text-3xl md:text-5xl`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

// main function
function ProductSlider({ type, rtl, title, products }) {
  const [route, setRoute] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (type === "new" || type === "sales" || type === "popular") {
      setRoute(`${type}-products`);
    } else if (type === "related" || type === "recentViewed") {
      setRoute(
        `all-${
          products.length > 0 &&
          (products[0].attributes
            ? products[0].attributes.genre
            : products[0].genre)
        }`
      );
    }
  }, [type, products]);
  const settings = {
    infinite: true,
    slidesToShow: products?.length > 4 ? 4 : products?.length,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: true,
    rtl: rtl ? true : false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SampleprevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          speed: 1000,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SampleprevArrow />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SampleprevArrow />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div className="relative my-10 font-serif container mx-auto ">
      <div className="text-center w-full my-4">
        <div className="capitalize text-2xl md:text-3xl ">
          {title ? title : ""}
        </div>
        <Link href={`/products/${route}`}>
          <a className="text-secondary text-lg my-4 capitalize">
            {t("product:view_all")}
          </a>
        </Link>
      </div>
      <Slider {...settings} className="">
        {products &&
          products.map((product) => (
            <div key={product.id} className="w-1/4">
              <ProductCard
                porductId={product.id}
                product={product.attributes ? product.attributes : product}
              />
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ProductSlider), { ssr: false });
