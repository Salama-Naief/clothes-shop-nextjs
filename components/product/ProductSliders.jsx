import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { FlatTree, motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import Link from "next/link";
import { API_URL } from "../../utils/connectionConfig";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

function ProductSliders({ productHover, product, porductId }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [productId, setProductId] = useState(
    product.productImg.data[0].attributes.name
  );
  const [imgHover, setImgHover] = useState(false);
  const [productRate, setProductRate] = useState(product.rate);
  const [waitRes, setWaitRes] = useState(false);
  const [liked, setLiked] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { t, i18n } = useTranslation();

  //use Effect
  useEffect(() => {
    if (
      product.userLiked &&
      product.userLiked.filter((a) => a.userId === state.user?.user.id).length >
        0
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [state.user, product]);

  //add to cart function
  const handleAddToCart = () => {
    const item = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const qty = item ? item.quantity + 1 : 1;
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, id: porductId, quantity: qty },
    });
  };

  //handle like and dislike
  const handleLike = async () => {
    let rate = {};
    if (!waitRes && state.user) {
      if (product.userLiked) {
        if (
          product.userLiked.filter((a) => a.userId === state.user.user.id)
            .length <= 0
        ) {
          rate = {
            data: {
              rate: product.rate + 1,
              userLiked: [...product.userLiked, { userId: state.user.user.id }],
            },
          };
        } else {
          rate = {
            data: {
              rate: product.rate - 1,
              userLiked: product.userLiked.filter(
                (a) => a.userId !== state.user.user.id
              ),
            },
          };
        }
      } else {
        rate = {
          data: {
            rate: product.rate + 1,
            user_likeds: [state.user.user.id],
          },
        };
      }
      setWaitRes(true);
      const res = await fetch(`${API_URL}/api/products/${porductId}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          authorization: `Bearer ${state.user.jwt}`,
        },
        body: JSON.stringify(rate),
      });

      const productRate = await res.json();
      if (productRate.error) {
        setWaitRes(false);
        setErrMsg(productRate.error.message);
      } else {
        setProductRate(productRate.data.attributes.rate);
        setErrMsg("");
        setWaitRes(false);
        router.push(router.asPath);
        setLiked(!liked);
      }
    }
  };

  //returm imge url
  const imgData = (img) => {
    if (img.attributes.formats.small) {
      return {
        url: img.attributes.formats.small.url,
        width: img.attributes.formats.small.width,
        height: img.attributes.formats.small.height,
      };
    } else {
      return {
        url: img.attributes.url,
        width: img.attributes.width,
        height: img.attributes.height,
      };
    }
  };
  return (
    <motion.div className="w-full">
      <Slider asNavFor={nav2} lazyLoad={true} ref={(slider) => setNav1(slider)}>
        {product.productImg.data.length &&
          product.productImg.data.map((productImg) => (
            <div
              key={productImg.id}
              className="relative flex justify-center  overflow-hidden "
            >
              <div className="h-68 w-full overflow-hidden">
                <Link href={`/product/${product?.slug}`}>
                  <a
                    onMouseEnter={() => setImgHover(true)}
                    onMouseLeave={() => setImgHover(false)}
                    className=" "
                  >
                    <div className="md:h-72 h-48 w-full relative  overflow-hidden">
                      {
                        <Image
                          src={productImg.attributes.url}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                          objectPosition={"center"}
                          loading="eager"
                        />
                      }
                    </div>
                  </a>
                </Link>
              </div>

              {productHover && (
                <div className="left-auto right-auto px-4 w-full absolute z-20 bottom-8">
                  <motion.button
                    initial={{ display: "none" }}
                    animate={
                      productHover ? { display: "block" } : { display: "none" }
                    }
                    transition={{ duration: 0.3, type: "tween" }}
                    onClick={() => handleAddToCart()}
                    className={` w-full transition ease-in-out delay-0 duration-500 border border-primary bg-white text-primary hover:bg-primary py-2 hover:text-white uppercase `}
                  >
                    {t("product:add_to_card")}
                  </motion.button>
                </div>
              )}
            </div>
          ))}
      </Slider>
      <div className="flex justify-between items-center px-4 my-4">
        <div className=" uppercase text-sm text-third">
          {product && product.name}
        </div>
        <div className="flex items-center">
          <div className="text-primary px-2">{productRate}</div>
          {liked ? (
            <MdOutlineFavorite
              onClick={() => handleLike()}
              className="cursor-pointer text-primary"
            />
          ) : (
            <MdOutlineFavoriteBorder
              onClick={() => handleLike()}
              className="cursor-pointer text-gray-800"
            />
          )}
        </div>
      </div>
      <Slider
        asNavFor={nav1}
        ref={(slider) => setNav2(slider)}
        slidesToShow={product.productImg.data.length}
        swipeToSlide={true}
        focusOnSelect={true}
        className="px-4"
      >
        {product.productImg.data.length &&
          product.productImg.data.map((productImg) => (
            <div key={productImg.id} className="flex justify-center ">
              <div
                onClick={() => setProductId(productImg.attributes.name)}
                className={`relative cursor-pointer h-7 w-7 overflow-hidden rounded-full border ${
                  productId === productImg.attributes.name
                    ? "border-secondary"
                    : "border-gray-400"
                } p-0.5`}
              >
                <Image
                  src={productImg.attributes.formats.thumbnail.url}
                  loading="eager"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  alt=""
                />
              </div>
            </div>
          ))}
      </Slider>
    </motion.div>
  );
}

export default dynamic(() => Promise.resolve(ProductSliders), { ssr: false });
