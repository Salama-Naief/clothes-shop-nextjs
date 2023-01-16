import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_URL } from "../../utils/connectionConfig";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

const Panner = ({ carousal }) => {
  const { i18n } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className="">
      <Slider {...settings} className="font-serif">
        {carousal.length > 0 &&
          carousal.map((item) => (
            <div
              key={item.id}
              className=" relative z-10 h-fit justify-center flex"
            >
              <div className="w-full h-1/2 relative overflow-hidden">
                <Image
                  src={item.attributes.img.data.attributes.url}
                  width={32}
                  height={16}
                  loading="eager"
                  layout="responsive"
                  priority
                  alt=""
                />
              </div>
              <div className="absolute z-20 max-w-xl  md:w-max max-h-fit bg-white p-2 md:p-4 bottom-2 md:inset-y-1/4 right-5 md:inset-x-1/2">
                <div className="border-2 border-gray-400 p-4 md:px-16 md:py-12 text-center">
                  <div className="text-gray-900 md:text-2xl capitalize">
                    {item.attributes.subTitle}
                  </div>
                  <div className="text-gray-900 text-lg md:text-4xl font-semibold py-2 md:py-4 capitaliz">
                    {item.attributes.title}
                  </div>
                  <div className="text-gray-900 mb-4 hidden md:block">
                    {item.attributes.desc}
                  </div>
                  <Link
                    href={`/products/collections-${item.attributes.collections.data[0].attributes.slug}`}
                  >
                    <a>
                      <div className="bg-primary text-white md:py-4 py-1 md:text-xl text-center w-full md:font-bold">
                        {item.attributes.btnText}
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Panner), { ssr: false });
