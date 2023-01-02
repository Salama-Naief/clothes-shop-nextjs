import { useState } from "react";
import { useTranslation } from "next-i18next";
import { API_URL } from "../../utils/connectionConfig";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const CardBox = ({ collection, height }) => {
  const [imgStyle, setImgStyle] = useState({});
  const { i18n } = useTranslation();
  const handleEnterStyle = () => {
    setImgStyle({
      scale: "scale-125",
      opacity: "opacity-50",
    });
  };
  const handleLeaveStyle = () => {
    setImgStyle({
      scale: "",
      opacity: "",
    });
  };
  return (
    <div className="p-4 font-serif my-4 w-full">
      <div className="flex items-center justify-center ">
        <div
          className={`text-primary text-xl  relative overflow-hidden w-full`}
        >
          <div className={`${height}  w-full relative overflow-hidden`}>
            {
              <Image
                src={collection.img.data.attributes.formats.small.url}
                alt=""
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                loading="eager"
                className={` ${imgStyle.scale} ${imgStyle.opacity}transition ease-in-out delay-100 duration-500`}
              />
            }
          </div>
          <div
            onMouseOver={() => handleEnterStyle()}
            onMouseLeave={() => handleLeaveStyle()}
            className="absolute top-0 left-0 w-full h-full  flex justify-center"
          >
            <div className="absolute w-full z-10 bottom-10 text-center">
              <Link href={`/products/${collection.category}-products`}>
                <button className="w-11/12 md:w-3/4 transition ease-in-out delay-100 text-gray-900 duration-400 hover:bg-secondary hover:text-white border bg-gray-100 border-primary py-2 px-6 capitalize">
                  {collection.subTitle}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CardBox), { ssr: false });
